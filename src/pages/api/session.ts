import { ConfidoLegalFirm, getFirm } from '@/confido-legal-requests/getFirm';
import prisma from '@/lib/prisma';
import { Firm, User } from '@prisma/client';
import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface Session {
  error?: any;
  user?: User;
  firm?: Firm;
  glFirm?: ConfidoLegalFirm;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Session>
) {
  try {
    const cookies = new Cookies(req, res);
    const userId = cookies.get('wave:userId');

    if (!userId) {
      return res.send({});
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    let firm = await prisma.firm.findUniqueOrThrow({
      where: {
        id: user.firmId,
      },
    });

    let glFirm: ConfidoLegalFirm | undefined;

    if (firm?.glApiToken) {
      try {
        glFirm = await getFirm(firm.glApiToken);
      } catch (e) {
        // token probably got revoked
        // remove token from db
        firm = await prisma.firm.update({
          where: {
            id: firm.id,
          },
          data: {
            glApiToken: null,
          },
        });
      }
    }

    res.send({ user, firm, glFirm });
  } catch (e: any) {
    res.statusCode = 401;
    res.send({ error: e.message });
  }
}
