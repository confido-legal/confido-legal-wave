import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const CREATE_FIRM_SIGN_UP_LINK = gql`
  mutation CreateFirmSignUpLink {
    createFirmSignUpLink {
      link
      expiresAt
    }
  }
`;

export interface CreateFirmSignUpLinkData {
  createFirmSignUpLink: {
    link: string;
    expiresAt: Date;
  };
}

export async function createFirmSignUpLink(
  firmApiToken: string
): Promise<CreateFirmSignUpLinkData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmApiToken,
    },
  });

  return client.request<CreateFirmSignUpLinkData>(CREATE_FIRM_SIGN_UP_LINK);
}
