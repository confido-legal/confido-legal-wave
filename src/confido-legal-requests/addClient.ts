import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const ADD_CLIENT = gql`
  mutation AddClient($input: AddClientInput!) {
    addClient(input: $input) {
      clientName
      id
    }
  }
`;

interface AddClientInput {
  clientName: string;
  firmId: string;
}

interface AddClientData {
  addClient: AddedClient;
}

export interface AddedClient {
  clientName: string;
  id: string;
}

export async function createClient(
  firmApiToken: string,
  clientName: string,
  firmId: string,
): Promise<AddedClient> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmApiToken,
    },
  });

  const variables = {
    input: {
      clientName,
      firmId,
    },
  };

  try {
    const clientRes = await client.request<AddClientData>(
      ADD_CLIENT,
      variables,
    );
    return clientRes.addClient;
  } catch (error) {
    throw error;
  }
}
