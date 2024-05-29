'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { ClientUploadedFileData } from 'uploadthing/types';
import { UTApi } from 'uploadthing/server';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: 'Email already in use!' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Verification email sent!' };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatch) {
      return { error: 'Incorrect password!' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: 'Settings Updated!' };
};

export const changeProfilePhoto = async (
  res: ClientUploadedFileData<{
    uploadedBy: string | undefined;
  }>[]
) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  if (!res[0]) {
    return { error: 'No file uploaded!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const utapi = new UTApi();

  if (dbUser.image) {
    const userImage = dbUser.image.split('/').pop();

    if (userImage) {
      await utapi.deleteFiles(userImage);
    }
  }

  const updatedUser = await db.user.update({
    where: { id: user.id as string },
    data: {
      image: res[0].url,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      image: true,
      userPage: {
        select: {
          id: true,
          biography: true,
          location: true,
          contactEmail: true,
          projects: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              url: true,
              image: true,
              categoryId: true,
              statusIsVisible: true,
              status: true,
              statusId: true,
            },
          },
        },
      },
    },
  });

  return { success: 'Profile photo updated!', user: updatedUser };
};

export const deleteProfilePhoto = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (!dbUser.image) {
    return { error: 'No image to delete!' };
  }

  const utapi = new UTApi();

  const userImage = dbUser.image.split('/').pop();

  if (userImage) {
    await utapi.deleteFiles(userImage);
  }

  const updatedUser = await db.user.update({
    where: { id: user.id as string },
    data: {
      image: null,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      image: true,
      userPage: {
        select: {
          id: true,
          biography: true,
          location: true,
          projects: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              url: true,
              image: true,
              categoryId: true,
              statusIsVisible: true,
              status: true,
              statusId: true,
            },
          },
        },
      },
    },
  });

  return { success: 'Profile photo deleted!', user: updatedUser };
};
