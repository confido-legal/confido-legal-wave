import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const GET_FIRM = gql`
  query GetFirm {
    firm {
      id
      isAcceptingPayments
      name
    }
  }
`;

export interface ConfidoLegalFirm {
  id: string;
  isAcceptingPayments: boolean;
  name: string;
}

export interface GetFirmData {
  firm: ConfidoLegalFirm;
}

export async function getFirm(firmApiToken: string): Promise<ConfidoLegalFirm> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmApiToken,
    },
  });

  const result = await client.request<GetFirmData>(GET_FIRM);
  return result.firm;
}
