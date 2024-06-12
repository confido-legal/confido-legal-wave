import gravitylegal, {
  Payment,
  RunPaymentInput,
} from '@/confido-legal-requests';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payment>
) {
  const { body } = req;
  const session = await getSessionFromRequestOrThrow(req);
  const firmToken = session.user.firm.glApiToken as string;

  const runPaymentInput: RunPaymentInput = {
    amount: parseInt(body.amount),
    payerEmail: body.email,
    paymentMethod: body.paymentMethod,
    payerName: body.name,
    paymentToken: body.paymentToken,
    savePaymentMethod: body.savePaymentMethod,
    sendReceipt: body.sendReceipt,
  };

  const result = await gravitylegal.runPayment(firmToken, runPaymentInput);
  res.status(200).json(result.runPayment);
}
