import {
  Payment,
  paymentSessionComplete,
  PaymentSessionCompleteInput,
} from '@/confido-legal-requests/paymentSessionComplete';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payment | { error: string }>
) {
  try {
    const { body } = req;
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken;

    if (!firmToken) {
      return res.status(400).json({ error: 'Firm is not connected to Confido Legal.' });
    }

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
  } catch (e) {
    console.error('Payment completion failed:', e);
    res.status(500).json({ error: getErrorMessage(e) });
  }
}
