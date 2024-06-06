'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

import { RegisterSchema } from '@/schemas';
import { getUserByEmail, getUserByUsername } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { UsernameSession } from '@/types';

export const register = async (
  values: z.infer<typeof RegisterSchema>,
  callbackUrl?: string
) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name, username } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      username,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token, callbackUrl);

  return { success: 'Confirmation email sent!' };
};

export const checkUsername = async (username: string) => {
  const user = await getUserByUsername(username);

  if (user) {
    return { error: 'Username already in use!' };
  }

  return { success: 'You can use this username!' };
};

export const fetchUsernameInSession = async () => {
  const session = await getIronSession<UsernameSession>(cookies(), {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'authjs.username',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  return session;
};

export const saveUsernameInSession = async (username: string) => {
  const session = await getIronSession<UsernameSession>(cookies(), {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'authjs.username',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  session.username = username as string;
  await session.save();
};

export const clearUsernameSession = async () => {
  const session = await getIronSession<UsernameSession>(cookies(), {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'authjs.username',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
  if (!session.username) return;
  await session.destroy();
};
