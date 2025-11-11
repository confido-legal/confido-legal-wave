import confido, { SPMPaymentInput } from '@/confido-legal-requests';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken as string;
    const { body } = req;

    const input: SPMPaymentInput = {
      storedPaymentMethodId: body.storedPaymentMethodId,
      operating: parseInt(body.amount),
      emailForReceipt: body.email,
      sendReceipt: body.sendReceipt,
    };

    const result = await confido.initiateSPMPayment(firmToken, input);

    res.status(200).json(result.initiateSPMPayment);
  } catch (e) {
    const message = (e as unknown as { message: string }).message;
    res.status(500).json({ error: message });
  }
}
