"use client";
import { ApolloProvider } from "@apollo/client/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import client from "@/lib/apollo-client";
import type { ReactNode } from "react";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Providers({ children }: { children: ReactNode }) {
  const content = <ApolloProvider client={client}>{children}</ApolloProvider>;

  if (!googleClientId) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
} 