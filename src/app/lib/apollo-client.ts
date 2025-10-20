import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Get the GraphQL endpoint URL
const getGraphQLEndpoint = () => {
  const url = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  
  if (!url) {
    console.warn('No GraphQL endpoint configured. Please set WORDPRESS_API_URL or NEXT_PUBLIC_WORDPRESS_API_URL environment variable.');
    // Return the working endpoint URL as fallback
    return 'http://weact.local/graphql';
  }
  
  return url;
};

const httpLink = new HttpLink({
  uri: getGraphQLEndpoint(),
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
  },
});

// Export as both default and named export for flexibility
export default client;
export { client };

