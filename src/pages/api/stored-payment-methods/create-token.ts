import confido from '@/confido-legal-requests';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string } | { error: string }>
) {
  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken;

    if (!firmToken) {
      res.status(400).json({ error: 'Your firm is not connected to Confido Legal. Please complete the connection setup on the home page first.' });
      return;
    }

    const token = await confido.createSavePaymentMethodToken({
      firmToken,
    });

    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ error: getErrorMessage(e) });
  }
}
