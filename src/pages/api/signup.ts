import { getErrorMessage } from '@/lib/getErrorMessage';
import prisma from '@/lib/prisma';
import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { body } = req;

    const user = await prisma.user.create({
      data: {
        password: body.password,
        username: body.username,
        firm: {
          create: {
            name: body.firmName,
          },
        },
      },
    });

    const cookies = new Cookies(req, res);
    cookies.set('wave:userId', user.id);

    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (e) {
    console.error('Signup failed:', e);
    res.status(400).json({ error: getErrorMessage(e) });
  }
}
