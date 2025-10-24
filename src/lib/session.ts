import { ConfidoLegalFirm, getFirm } from "@/confido-legal-requests/getFirm";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { IncomingMessage } from "http";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { ParsedUrlQuery } from "querystring";

type UserWithFirm = Prisma.UserGetPayload<{
  include: {
    firm: true;
  };
}>;

export interface Session {
  user: UserWithFirm | null;
}

export interface AuthedSession {
  user: UserWithFirm;
}

export interface FullSession {
  user: UserWithFirm;
  firm: Prisma.FirmGetPayload<{}>;
  glFirm?: ConfidoLegalFirm;
}

export async function getSessionFromRequest(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
): Promise<Session> {
  const userId = req.cookies["wave:userId"];

  let user = null;

  if (userId) {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        firm: true,
      },
    });
  }

  return {
    user,
  };
}

export async function getSessionFromRequestOrThrow(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
): Promise<AuthedSession> {
  const session = await getSessionFromRequest(req);

  if (!session.user) {
    throw new Error("user not found");
  }

  return session as AuthedSession;
}

export async function getFullSessionFromRequestOrThrow(
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
): Promise<FullSession> {
  const session = await getSessionFromRequestOrThrow(req);

  const firm = session.user.firm;
  let glFirm: ConfidoLegalFirm | undefined;

  if (firm?.glApiToken) {
    glFirm = await getFirm(firm.glApiToken);
  }

  return {
    user: session.user,
    firm,
    glFirm,
  };
}

export function withSession(
  getServerSideProps?: GetServerSidePropsWithSession
): GetServerSideProps {
  return async (context) => {
    const { req } = context;
    const session = await getSessionFromRequest(req);

    const contextWithSession: GetServerSidePropsContextWithSession = {
      ...context,
      session,
    };

    if (getServerSideProps) {
      return getServerSideProps(contextWithSession);
    }

    return {
      props: {
        session,
      },
    };
  };
}

export interface PropsWithAuth {
  user: UserWithFirm;
}

export function requireAuth(
  getServerSideProps?: GetServerSidePropsWithSession
): GetServerSideProps {
  return withSession(async (context) => {
    const { session } = context;

    if (!session.user) {
      return {
        redirect: {
          destination: "/signup",
          permanent: false,
        },
      };
    }

    if (getServerSideProps) {
      return getServerSideProps(context);
    }

    return {
      props: {
        session,
      },
    };
  });
}

type GetServerSidePropsContextWithSession<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = GetServerSidePropsContext<Params, Preview> & { session: Session };

type GetServerSidePropsWithSession<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContextWithSession<Params, Preview>
) => Promise<GetServerSidePropsResult<Props>>;
