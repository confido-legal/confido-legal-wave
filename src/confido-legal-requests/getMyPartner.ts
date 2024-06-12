import { gqlEndpoint } from '@/confido-legal-requests';
import { getPartnerToken } from '@/lib/getPartnerToken';
import { GraphQLClient, gql } from 'graphql-request';

const GET_MY_PARTNER = gql`
  query GetMyPartner {
    me {
      partner {
        id
        appId
      }
    }
  }
`;

export interface GravityLegalPartner {
  id: string;
  appId: string;
}

export interface GetMyPartnerData {
  me: {
    partner: GravityLegalPartner;
  };
}

export async function getMyPartner(): Promise<GravityLegalPartner> {
  const partnerToken = getPartnerToken();

  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': partnerToken,
    },
  });

  const result = await client.request<GetMyPartnerData>(GET_MY_PARTNER);
  return result.me.partner;
}
