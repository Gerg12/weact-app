'use client';

import { ApolloProvider } from '@apollo/client/react';
import client from './lib/apollo-client';
import JotaiProvider from './providers/JotaiProvider';

/**
 * Providers Component
 * 
 * Combines all application providers:
 * - ApolloProvider: For GraphQL data fetching
 * - JotaiProvider: For lightweight state management
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <JotaiProvider>
        {children}
      </JotaiProvider>
    </ApolloProvider>
  );
}


