import { createFirm } from '@/confido-legal-requests';
import { createFirmSignUpLink } from '@/confido-legal-requests/createFirmSignUpLink';
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
    const data = await createFirmSignUpLink(session.user.firm.glApiToken);

    return res.send({
      ...data.createFirmSignUpLink,
    });
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

  // Send the signup link back to the client
  res.send({
    ...firm.createFirm.signUpLink,
  });
}
