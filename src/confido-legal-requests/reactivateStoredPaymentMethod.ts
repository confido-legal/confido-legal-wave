import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const REACTIVATE_STORED_PAYMENT_METHOD = gql`
  mutation ReactivateStoredPaymentMethod($input: ReactivateStoredPaymentMethodInput!) {
    reactivateStoredPaymentMethod(input: $input) {
      id
      status
    }
  }
`;

export interface ReactivateStoredPaymentMethodInput {
  id: string;
}

export interface ReactivateStoredPaymentMethodResult {
  reactivateStoredPaymentMethod: {
    id: string;
    status: string;
  };
}

export async function reactivateStoredPaymentMethod(
  firmToken: string,
  id: string
): Promise<boolean> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  const variables = {
    input: { id },
  };

  const res = await client.request<ReactivateStoredPaymentMethodResult>(
    REACTIVATE_STORED_PAYMENT_METHOD,
    variables
  );

  return res.reactivateStoredPaymentMethod.status === 'active';
}
