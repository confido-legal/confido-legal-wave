import { getClient } from '@/confido-legal-requests/getClient';
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

    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }

    const client = await getClient(firmToken, clientId);
    res.status(200).json(client);
  } catch (e) {
    console.error('Failed to fetch client:', e);
    res.status(500).json({ error: getErrorMessage(e) });
  }
}
