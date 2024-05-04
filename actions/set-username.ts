'use server';

import * as z from 'zod';

import { UsernameSchema } from '@/schemas';
import { getUserById, getUserByUsername } from '@/data/user';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const setUsername = async (values: z.infer<typeof UsernameSchema>) => {
  const validatedFields = UsernameSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid username!' };
  }

  const { username } = validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (dbUser.username) {
    return { error: 'You already have a username!' };
  }

  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    return { error: 'Username already exists!' };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      username: username,
    },
  });

  return { success: 'Your username added successfully!' };
};
