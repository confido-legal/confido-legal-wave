import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const INITIATE_SPM_PAYMENT = gql`
  mutation InitiateSPMPayment($input: SPMPaymentInput!) {
    initiateSPMPayment(input: $input) {
      id
      amount
      status
      cardBrand
      transactions {
        id
        amountProcessed
      }
      storedPaymentMethod {
        id
        lastFour
        cardBrand
      }
    }
  }
`;

export interface SPMPaymentInput {
  storedPaymentMethodId: string;
  operating?: number;
  trust?: number;
  emailForReceipt?: string;
  sendReceipt?: boolean;
  surchargeEnabled?: boolean;
  matterId?: string;
  externalId?: string;
}

export interface SPMPaymentResult {
  initiateSPMPayment: {
    id: string;
    amount: number;
    status: string;
    cardBrand?: string;
    transactions: Array<{
      id: string;
      amountProcessed: number;
    }>;
    storedPaymentMethod: {
      id: string;
      lastFour: string;
      cardBrand?: string;
    };
  };
}

export async function initiateSPMPayment(
  firmToken: string,
  input: SPMPaymentInput
): Promise<SPMPaymentResult> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  const variables = {
    input,
  };

  return client.request<SPMPaymentResult>(INITIATE_SPM_PAYMENT, variables);
}
