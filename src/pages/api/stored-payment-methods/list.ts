import confido from '@/confido-legal-requests';
import { StoredPaymentMethodForList } from '@/confido-legal-requests/getStoredPaymentMethods';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoredPaymentMethodForList[] | { error: string }>
) {
  try {
    const session = await getSessionFromRequestOrThrow(req);
    const firmToken = session.user.firm.glApiToken as string;

    const storedPaymentMethods = await confido.getStoredPaymentMethods(
      firmToken
    );

    res.status(200).json(storedPaymentMethods);
  } catch (e) {
    const message = (e as unknown as { message: string }).message;
    res.status(500).json({ error: message });
  }
}