import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const DEACTIVATE_STORED_PAYMENT_METHOD = gql`
  mutation DeactivateStoredPaymentMethod($input: DeactivateStoredPaymentMethodInput!) {
    deactivateStoredPaymentMethod(input: $input) {
      id
      status
    }
  }
`;

export interface DeactivateStoredPaymentMethodInput {
  id: string;
}

export interface DeactivateStoredPaymentMethodResult {
  deactivateStoredPaymentMethod: {
    id: string;
    status: string;
  };
}

export async function deactivateStoredPaymentMethod(
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

  const res = await client.request<DeactivateStoredPaymentMethodResult>(
    DEACTIVATE_STORED_PAYMENT_METHOD,
    variables
  );

  return res.deactivateStoredPaymentMethod.status === 'inactive';
}
