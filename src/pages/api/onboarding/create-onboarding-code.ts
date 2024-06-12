import { createFirm } from '@/confido-legal-requests';
import { createOnboardingToken } from '@/confido-legal-requests/createOnboardingToken';
import prisma from '@/lib/prisma';
import { getSessionFromRequestOrThrow } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSessionFromRequestOrThrow(req);

  if (session.user.firm.glApiToken) {
    // Firm already exists in Confido Legal,
    // so we can just generate a new signup link
    const data = await createOnboardingToken(session.user.firm.glApiToken);
    const token = data.createOnboardingToken.token;

    return res.send({ token });
  }

  // Create a new Firm in Confido Legal
  const firm = await createFirm(session.user.firm.name);

  // Save the Firm Api Token in our database
  await prisma.firm.update({
    where: {
      id: session.user.firm.id,
    },
    data: {
      glApiToken: firm.createFirm.apiToken,
    },
  });

  return res.send({ token: firm.createFirm.onboardingToken.token });
}
