import confido, { PaymentMethod } from '@/confido-legal-requests';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken as string;

    const body = req.body;

    const result = await confido.completeSavePaymentMethod(firmToken, {
      payerEmail: body.email,
      payerName: body.clientName,
      paymentMethod: body.paymentMethod as PaymentMethod,
      savePaymentMethodToken: body.token,
    });

    res.status(200).json(result.completeSavePaymentMethod);
  } catch (e) {
    const message = (e as unknown as { message: string }).message;
    res.status(500).json({ error: message });
  }
}
