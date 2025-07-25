"use client";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 