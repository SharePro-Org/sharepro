import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Utility Functions
export const getUserData = (): any | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = (): string | null => {
  const userData = getUserData();
  return userData?.accessToken || null;
};

export const setToken = (token: string): void => {
  const userData = getUserData() || {};
  userData.accessToken = token;
  localStorage.setItem('userData', JSON.stringify(userData));
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mysharepro.com/graphql/";
if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not set in environment variables.'
  );
}

// Log Link
const logLink = new ApolloLink((operation, forward) => {
  console.log('Outgoing GraphQL Request:', {
    query: operation.query.loc?.source.body,
    variables: operation.variables,
  });

  return forward(operation);
});

// Auth Link
const authLink = setContext((_, { headers }: { headers?: Record<string, string> }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : '',
      'Content-Type': 'application/json',
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
    throw new Error('Authentication required');
  }

  const apiURL = API_BASE_URL;

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        operationName: "refreshToken"
      }),
    });

    const result = await response.json();
    const res: RefreshTokenResponse = result?.data;
    const newAccessToken = res.data?.refreshToken?.token;
    const newRefreshToken = res.data?.refreshToken?.refreshToken;

    if (newRefreshToken && newAccessToken) {
      const userData = getUserData() || {};
      userData.accessToken = newAccessToken;
      userData.refreshToken = newRefreshToken;
      localStorage.setItem('userData', JSON.stringify(userData));
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
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

const refreshLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    forward(operation).subscribe({
      next: (result) => {
        const hasExpiredError = result?.errors?.some(
          (error: any) =>
            error.message === 'Signature has expired'
        );
        if (hasExpiredError) {
          handleTokenRefresh(operation, forward)
            .then((refreshedObservable) => refreshedObservable.subscribe(observer))
            .catch((error) => observer.error(error));
        } else {
          observer.next(result);
          observer.complete();
        }
      },
      error: (error) => {
        if (error.message.includes('Signature has expired')) {
          handleTokenRefresh(operation, forward)
            .then((refreshedObservable) => refreshedObservable.subscribe(observer))
            .catch((refreshError) => observer.error(refreshError));
        } else {
          observer.error(error);
        }
      },
    });
  });
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      console.error(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Use Apollo's HttpLink for proper JSON serialization
const httpLink = new HttpLink({ uri: API_BASE_URL });

// Combine Links
const link = ApolloLink.from([
  logLink,
  authLink,
  refreshLink,
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;