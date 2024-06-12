import confido from '@/confido-legal-requests';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string } | { error: string }>
) {
  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken as string;

    const token = await confido.createSavePaymentMethodToken({
      firmToken,
    });

    res.status(200).json({ token });
  } catch (e) {
    const message = (e as unknown as { message: string }).message;
    res.status(500).json({ error: message });
  }
}
