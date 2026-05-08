import { createClient } from '@/confido-legal-requests/addClient';
import { getErrorMessage } from '@/lib/getErrorMessage';
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
    const firmToken = session.user.firm.glApiToken;

    if (!firmToken) {
      return res.status(400).json({ error: 'Firm is not connected to Confido Legal.' });
    }

    const { clientName } = req.body;

    if (!clientName || !clientName.trim()) {
      return res.status(400).json({ error: 'Client name is required.' });
    }

    const glFirm = await import('@/confido-legal-requests/getFirm').then(m => m.getFirm(firmToken));
    const client = await createClient(firmToken, clientName, glFirm.id);

    res.status(200).json(client);
  } catch (e) {
    console.error('Failed to add client:', e);
    res.status(500).json({ error: getErrorMessage(e) });
  }
}
