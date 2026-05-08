import { PaymentMethod } from '@/confido-legal-hook/ConfidoLegal';
import confido from '@/confido-legal-requests';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken;

    if (!firmToken) {
      res.status(400).json({ error: 'Your firm is not connected to Confido Legal.' });
      return;
    }

    const body = req.body;

    const result = await confido.completeSavePaymentMethod(firmToken, {
      payerEmail: body.email,
      payerName: body.clientName,
      paymentMethod: body.paymentMethod as PaymentMethod,
      savePaymentMethodToken: body.token,
    });

    res.status(200).json(result.completeSavePaymentMethod);
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
}
