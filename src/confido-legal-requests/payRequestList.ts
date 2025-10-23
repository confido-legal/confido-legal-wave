import { gqlEndpoint } from "@/confido-legal-requests";
import { GraphQLClient, gql } from "graphql-request";

const PAY_REQUEST_LIST = gql`
  query PayRequestList($input: PayRequestInput!) {
    payRequestList(input: $input) {
      externalId
      transactions {
        id
        status_v2
      }
    }
  }
`;

export interface PayRequestInput {
  externalId?: string | null;
  firmId?: string | null;
}

export interface Transaction {
  id: string;
  status_v2: string;
}

export interface PayRequest {
  externalId: string;
  transactions: Transaction[];
}

export interface PayRequestListData {
  payRequestList: PayRequest[];
}

export async function payRequestList(
  firmToken: string,
  input: PayRequestInput
): Promise<PayRequestListData> {
  const client = new GraphQLClient(gqlEndpoint, {
    headers: {
      "x-api-key": firmToken,
    },
  });

  const variables = {
    input,
  };

  return client.request<PayRequestListData>(PAY_REQUEST_LIST, variables);
}
