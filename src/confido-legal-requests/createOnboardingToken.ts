import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const CREATE_ONBOARDING_TOKEN = gql`
  mutation CreateOnboardingToken {
    createOnboardingToken {
      expiresAt
      token
    }
  }
`;

export interface CreateOnboardingTokenData {
  createOnboardingToken: {
    expriresAt: Date;
    token: string;
  };
}

export async function createOnboardingToken(
  firmApiToken: string
): Promise<CreateOnboardingTokenData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmApiToken,
    },
  });

  return client.request<CreateOnboardingTokenData>(CREATE_ONBOARDING_TOKEN);
}
