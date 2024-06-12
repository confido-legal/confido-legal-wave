import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const EXCHANGE_CODE = gql`
  mutation ExchangedCodeForFirmToken($code: String!) {
    exchangeCodeForFirmApiToken(code: $code)
  }
`;

export interface StartPaymentSessionResult {
  exchangeCodeForFirmApiToken: string;
}

export async function exchangeCodeForFirmToken(code: string): Promise<string> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': process.env.GL_PARTNER_TOKEN as string,
    },
  });

  const variables = {
    code,
  };

  const res = await client.request<StartPaymentSessionResult>(
    EXCHANGE_CODE,
    variables
  );

  return res.exchangeCodeForFirmApiToken;
}
