import confido from '@/confido-legal-requests';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken as string;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing payment method id' });
    }

    const success = await confido.reactivateStoredPaymentMethod(firmToken, id);

    res.status(200).json({ success });
  } catch (e) {
    const message = (e as unknown as { message: string }).message;
    res.status(500).json({ error: message });
  }
}
