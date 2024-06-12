import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const DISCONNECT_FROM_PARTNER = gql`
  mutation DisconnectFromPartner {
    disconnectFromPartner {
      id
    }
  }
`;

export interface DisconnectFromPartnerData {
  disconnectFromPartner: {
    id: string;
  };
}

export async function disconnect(
  firmToken: string
): Promise<DisconnectFromPartnerData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  return client.request<DisconnectFromPartnerData>(DISCONNECT_FROM_PARTNER);
}
