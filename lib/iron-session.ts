import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface IronSessionData {
  cookieName: string;
}

export async function getIronSessionData({ cookieName }: IronSessionData) {
  const session = await getIronSession(cookies(), {
    password: process.env.SESSION_SECRET as string,
    cookieName,
  });

  return session;
}
