import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const GET_CLIENT = gql`
  query GetClient($id: String!) {
    client(id: $id) {
      id
      clientName
      email
      phone
    }
  }
`;

export interface Client {
  id: string;
  clientName: string;
  email?: string;
  phone?: string;
}

interface GetClientData {
  client: Client;
}

export async function getClient(
  firmApiToken: string,
  clientId: string,
): Promise<Client> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmApiToken,
    },
  });

  const variables = {
    id: clientId,
  };

  try {
    console.log('should be fetching client');
    const clientRes = await client.request<GetClientData>(
      GET_CLIENT,
      variables,
    );
    return clientRes.client;
  } catch (error) {
    console.error('Failed to fetch client:', error);
    throw error;
  }
}
