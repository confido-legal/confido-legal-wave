import { exchangeCodeForFirmToken } from '@/confido-legal-requests/exchangeCodeForFirmToken';
import prisma from '@/lib/prisma';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSessionFromRequestOrThrow(req);
  const { query } = req;
  const { code, state } = query;
  // The state that was passed to
  // confidolegal.com/connect/legal-wave?state=STATE
  console.log('query.state=', state);

  // make a call to Confido Legal to
  // exchange the code for a token
  const firmToken = await exchangeCodeForFirmToken(code as string);

  // now save the firmToken
  // under this user's firm
  const { firm } = session.user;
  await prisma.firm.update({
    where: {
      id: firm.id,
    },
    data: {
      glApiToken: firmToken,
    },
  });

  res.redirect(303, '/');
}
