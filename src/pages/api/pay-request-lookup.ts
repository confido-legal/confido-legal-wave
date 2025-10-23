import gravitylegal, {
  PayRequestInput,
  PayRequestListData,
} from "@/confido-legal-requests";
import { getFullSessionFromRequestOrThrow } from "@/lib/session";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PayRequestListData | { error: string; details?: string }>
) {
  const { body } = req;
  const session = await getFullSessionFromRequestOrThrow(req);
  const firmToken = session.firm.glApiToken as string;

  if (!firmToken) {
    return res.status(400).json({
      error: "Firm not connected",
      details: "Please connect your firm first",
    });
  }

  if (!session.glFirm?.id) {
    return res.status(400).json({
      error: "Failed to fetch firm data",
      details: "Please reconnect your firm",
    });
  }

  const payRequestInput: PayRequestInput = {
    externalId: body.externalId,
    firmId: session.glFirm.id,
  };

  try {
    const result = await gravitylegal.payRequestList(
      firmToken,
      payRequestInput
    );
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching pay request:", error);
    res.status(400).json({
      error: "Failed to fetch pay request data",
      details: error.message || "Unknown error",
    });
  }
}
