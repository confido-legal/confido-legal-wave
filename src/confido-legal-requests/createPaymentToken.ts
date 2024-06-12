import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const CREATE_PAYMENT_TOKEN = gql`
  mutation CreatePaymentToken($input: CreatePaymentTokenInput) {
    createPaymentToken(input: $input) {
      paymentToken
    }
  }
`;

export interface CreatePaymentTokenParams {
  firmToken: string;
  bankAccountId?: string;
  paymentLinkId?: string;
}

export interface CreatePaymentTokenResult {
  createPaymentToken: {
    paymentToken: string;
  };
}

export async function createPaymentToken(
  params: CreatePaymentTokenParams
): Promise<any> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': params.firmToken,
    },
  });

  const variables = {
    input: {
      bankAccountId: params.bankAccountId,
      paymentLinkId: params.paymentLinkId,
    },
  };

  const res = await client.request<CreatePaymentTokenResult>(
    CREATE_PAYMENT_TOKEN,
    variables
  );

  return res.createPaymentToken.paymentToken;
}
