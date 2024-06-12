import { disconnect as disconnectConfidoLegal } from '@/confido-legal-requests/disconnect';
import prisma from '@/lib/prisma';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSessionFromRequestOrThrow(req);

  const firmToken = session.user.firm.glApiToken;

  if (!firmToken) {
    // no token, so not connected
    return res.send(200);
  }

  await disconnectConfidoLegal(firmToken);

  // Nullify the Firm Api Token in our database
  await prisma.firm.update({
    where: {
      id: session.user.firm.id,
    },
    data: {
      glApiToken: null,
    },
  });

  res.send(200);
}
