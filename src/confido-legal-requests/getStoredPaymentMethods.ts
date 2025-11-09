import { gqlEndpoint } from '@/confido-legal-requests';
import { GraphQLClient, gql } from 'graphql-request';

const GET_STORED_PAYMENT_METHODS = gql`
  query GetStoredPaymentMethods {
    firm {
      id
      name
      storedPaymentMethods {
        edges {
          node {
            id
            lastFour
            cardBrand
            payerName
            paymentMethod
            status
          }
        }
      }
    }
  }
`;

export interface StoredPaymentMethodForList {
  id: string;
  lastFour: string;
  cardBrand?: string;
  payerName?: string;
  payerEmail?: string;
  paymentMethod: string;
  status: string;
}

interface PaymentMethodEdge {
  node: StoredPaymentMethodForList;
}

interface Firm {
  id: string;
  name: string;
  storedPaymentMethods: {
    edges: PaymentMethodEdge[];
  };
}

export interface GetStoredPaymentMethodsResult {
  firm: Firm;
}

export async function getStoredPaymentMethods(
  firmToken: string
): Promise<StoredPaymentMethodForList[]> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      'x-api-key': firmToken,
    },
  });

  const res = await client.request<GetStoredPaymentMethodsResult>(
    GET_STORED_PAYMENT_METHODS
  );

  // create an array of payment method nodes
  const allPaymentMethods: StoredPaymentMethodForList[] = [];
  res.firm.storedPaymentMethods.edges.forEach((edge) => {
    allPaymentMethods.push(edge.node);
  });

  return allPaymentMethods;
}
