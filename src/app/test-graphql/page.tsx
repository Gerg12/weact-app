'use client';

import { useQuery, gql } from '@apollo/client';

// Simple query to test GraphQL connection
const GET_SITE_INFO = gql`
  query GetSiteInfo {
    generalSettings {
      title
      description
      url
    }
  }
`;

export default function TestGraphQL() {
  const { loading, error, data } = useQuery(GET_SITE_INFO);

  if (loading) return <div className="container mx-auto p-8">Loading...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">GraphQL Error</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">{error.message}</p>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-red-600">View Details</summary>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(error, null, 2)}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">GraphQL Connection Test</h1>
      
      <div className="bg-green-50 border border-green-200 rounded p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">✓ Connection Successful!</h2>
        
        <div className="space-y-2">
          <p><strong>Site Title:</strong> {data?.generalSettings?.title}</p>
          <p><strong>Description:</strong> {data?.generalSettings?.description}</p>
          <p><strong>URL:</strong> {data?.generalSettings?.url}</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded p-6">
        <h3 className="font-semibold mb-2">Raw Response:</h3>
        <pre className="text-xs overflow-auto bg-white p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}


