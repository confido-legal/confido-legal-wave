import { PaymentMethod, gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const COMPLETE_SAVE_PAYMENT_METHOD = gql`
  mutation CompleteSavePaymentMethod(
    $input: CompleteSavePaymentMethodSessionInput!
  ) {
    completeSavePaymentMethod(input: $input) {
      id
      lastFour
    }
  }
`;

export interface CompleteSavePaymentMethodInput {
  clientId?: string;
  payerEmail?: string;
  payerName?: string;
  payerZip?: string;
  paymentMethod: PaymentMethod;
  savePaymentMethodToken: string;
}

export interface CompleteSavePaymentMethodResult {
  completeSavePaymentMethod: StoredPaymentMethod;
}

export interface StoredPaymentMethod {
  id: string;
  lastFour: string;
}

export async function completeSavePaymentMethod(
  firmToken: string,
  input: CompleteSavePaymentMethodInput
): Promise<CompleteSavePaymentMethodResult> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  const variables = {
    input,
  };

  return client.request<CompleteSavePaymentMethodResult>(
    COMPLETE_SAVE_PAYMENT_METHOD,
    variables
  );
}
