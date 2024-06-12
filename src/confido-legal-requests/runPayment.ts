import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const RUN_PAYMENT = gql`
  mutation RunPayment($input: RunPaymentInput!) {
    runPayment(input: $input) {
      id
      status
      storedPaymentMethod {
        cardBrand
        payerName
        paymentMethod
        lastFour
        id
      }
      transactions {
        id
        amountProcessed
      }
    }
  }
`;

export type PaymentMethod = 'CREDIT' | 'DEBIT' | 'ACH';

export interface RunPaymentInput {
  amount: number;
  payerEmail?: string;
  payerName?: string;
  payerZip?: string;
  paymentMethod: PaymentMethod;
  paymentToken: string;
  savePaymentMethod?: boolean;
  sendReceipt?: boolean;
}

export interface RunPaymentData {
  runPayment: Payment;
}

export interface Payment {
  id: string;
  status: string;
  storedPaymentMethod: StoredPaymentMethodForRunPayment;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amountProcessed: number;
}

export interface StoredPaymentMethodForRunPayment {
  cardBrand: string;
  payerName: string;
  paymentMethod: string;
  lastFour: string;
  id: string;
}

export async function runPayment(
  firmToken: string,
  input: RunPaymentInput
): Promise<RunPaymentData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  const variables = {
    input,
  };

  return client.request<RunPaymentData>(RUN_PAYMENT, variables);
}
