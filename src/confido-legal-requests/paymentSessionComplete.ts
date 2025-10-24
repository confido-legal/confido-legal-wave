import { gqlEndpoint } from "@/confido-legal-requests";
import { GraphQLClient, gql } from "graphql-request";
import { v4 } from "uuid";

const PAYMENT_SESSION_COMPLETE = gql`
  mutation PaymentSessionComplete($input: PaymentSessionCompleteInput!) {
    paymentSessionComplete(input: $input) {
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
        payRequest {
          externalId
        }
      }
    }
  }
`;

export type BankAccountType = "CHECKING" | "SAVINGS";

export type PaymentSessionMethod = "CREDIT" | "DEBIT" | "ACH";

export interface PaymentSessionCompleteInput {
  bankAccountType?: BankAccountType;
  amount: number;
  clientId?: string;
  externalId?: string;
  matterId?: string;
  method: PaymentSessionMethod;
  payerEmail?: string;
  payerName?: string;
  payerZip?: string;
  paymentSessionToken: string;
  savePaymentMethod?: boolean;
  sendReceipt?: boolean;
  surchargeEnabled?: boolean;
}

export interface PaymentSessionCompleteData {
  paymentSessionComplete: Payment;
}

export interface Payment {
  id: string;
  status: string;
  storedPaymentMethod: StoredPaymentMethodForPaymentSessionComplete;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amountProcessed: number;
}

export interface StoredPaymentMethodForPaymentSessionComplete {
  cardBrand: string;
  payerName: string;
  paymentMethod: string;
  lastFour: string;
  id: string;
}

export async function paymentSessionComplete(
  firmToken: string,
  input: PaymentSessionCompleteInput
): Promise<PaymentSessionCompleteData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      "x-api-key": firmToken,
    },
  });

  const externalId = v4();

  const variables = {
    input: {
      ...input,
      externalId,
    },
  };

  return client.request<PaymentSessionCompleteData>(
    PAYMENT_SESSION_COMPLETE,
    variables
  );
}
