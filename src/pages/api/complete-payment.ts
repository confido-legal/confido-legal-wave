import {
  Payment,
  paymentSessionComplete,
  PaymentSessionCompleteInput,
} from '@/confido-legal-requests/paymentSessionComplete';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payment>
) {
  const { body } = req;
  const session = await getSessionFromRequestOrThrow(req);
  const firmToken = session.user.firm.glApiToken as string;

  const paymentSessionCompleteInput: PaymentSessionCompleteInput = {
    amount: parseInt(body.amount),
    payerEmail: body.email,
    method: body.paymentMethod,
    payerName: body.name,
    paymentSessionToken: body.paymentToken,
    savePaymentMethod: body.savePaymentMethod,
    sendReceipt: body.sendReceipt,
  };

  const result = await paymentSessionComplete(
    firmToken,
    paymentSessionCompleteInput
  );

  res.status(200).json(result.paymentSessionComplete);
}
