import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  HttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// Utility Functions
export const getUserData = (): any | null => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = (): string | null => {
  const userData = getUserData();
  return userData?.accessToken || null;
};

export const setToken = (token: string): void => {
  const userData = getUserData() || {};
  userData.accessToken = token;
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userData");
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mysharepro.com/graphql/";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.mysharepro.com/ws/graphql/";
// const API_BASE_URL = "http://localhost:4000/graphql/"; (development)
// const WS_URL = "ws://localhost:4000/ws/graphql/"; (development)

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set in environment variables.");
}

// Log Link
const logLink = new ApolloLink((operation, forward) => {
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 GraphQL Request:", {
      operationName: operation.operationName,
      variables: operation.variables,
    });
  }
  return forward(operation);
});

// WebSocket Link for subscriptions
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
      createClient({
        url: WS_URL,
        connectionParams: () => {
          const token = getAuthToken();
          return {
            Authorization: token ? `JWT ${token}` : "",
          };
        },
        on: {
          connected: () => console.log("🔌 WebSocket connected"),
          closed: () => console.log("🔌 WebSocket disconnected"),
        },
      })
    )
    : null;

// Auth Link
const authLink = setContext((operation, prevContext) => {
  const token = getAuthToken();
  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `JWT ${token}` : "",
      "Content-Type": "application/json",
    },
  };
});

// Refresh Token Handling
interface RefreshTokenResponse {
  data?: {
    refreshToken?: {
      token: string;
      refreshToken: string;
    };
  };
}

const handleTokenRefresh = async (
  operation: any,
  forward: any
): Promise<Observable<any>> => {
  const userData = getUserData();
  const refreshToken = userData?.refreshToken;
  if (!refreshToken) {
    throw new Error("Authentication required");
  }

  const apiURL = API_BASE_URL;

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        mutation refreshToken($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
          }
        }
        `,
        variables: { refreshToken },
        operationName: "refreshToken",
      }),
    });

    const result = await response.json();
    const res: any = result?.data;
    const newAccessToken = res?.refreshToken?.token;
    const newRefreshToken = res?.refreshToken?.refreshToken;

    if (newRefreshToken && newAccessToken) {
      const userData = getUserData() || {};
      userData.accessToken = newAccessToken;
      userData.refreshToken = newRefreshToken;
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    if (newAccessToken) {
      setToken(newAccessToken);
      operation.setContext({
        headers: {
          ...operation.getContext().headers,
          authorization: `JWT ${newAccessToken}`,
        },
      });

      return forward(operation);
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

const refreshLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    forward(operation).subscribe({
      next: (result) => {
        const hasExpiredError = result?.errors?.some(
          (error: any) => error.message === "Signature has expired"
        );
        if (hasExpiredError) {
          handleTokenRefresh(operation, forward)
            .then((refreshedObservable) =>
              refreshedObservable.subscribe(observer)
            )
            .catch((error) => observer.error(error));
        } else {
          observer.next(result);
          observer.complete();
        }
      },
      error: (error) => {
        if (error.message.includes("Signature has expired")) {
          handleTokenRefresh(operation, forward)
            .then((refreshedObservable) =>
              refreshedObservable.subscribe(observer)
            )
            .catch((refreshError) => observer.error(refreshError));
        } else {
          observer.error(error);
        }
      },
    });
  });
});

// Error Link
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }: any) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((err: any) => {
        console.error(
          `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
        );

        if (err.extensions?.code === "UNAUTHENTICATED") {
          console.log("🔒 Authentication error detected, redirecting to login");
          clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/sign-in";
          }
        }
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      if ("statusCode" in networkError && networkError.statusCode === 401) {
        console.log("🔒 401 Unauthorized, clearing tokens");
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/sign-in";
        }
      }
    }
  }
);

// Use Apollo's HttpLink for proper JSON serialization
const httpLink = new HttpLink({ uri: API_BASE_URL });

// Split link for HTTP/WebSocket routing
const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
    : httpLink;

// Combine Links
const link = ApolloLink.from([
  logLink,
  authLink,
  refreshLink,
  errorLink,
  splitLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          notifications: {
            keyArgs: ["unreadOnly", "notificationType"],
            merge(existing = { edges: [], pageInfo: {} }, incoming) {
              if (!incoming) return existing;
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              };
            },
          },
          businesses: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          campaigns: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          analytics: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          referrals: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          rewards: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          support: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          accounts: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default client;
