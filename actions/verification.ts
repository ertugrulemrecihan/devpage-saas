'use server';

import * as z from 'zod';

import { VerificationSendSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { db } from '@/lib/db';

export const sendEmailVerificationMessage = async (
  values: z.infer<typeof VerificationSendSchema>
) => {
  const validatedFields = VerificationSendSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'An error occurred!' };
  }

  const verificationEmail = await db.verificationToken.findUnique({
    where: {
      email: existingUser.email as string,
    },
  });

  if (verificationEmail) {
    return sendVerificationEmail(email, verificationEmail.token);
  }

  const verificationToken = await generateVerificationToken(email);
  sendVerificationEmail(email, verificationToken.token);

  return { success: 'Reset email sent!' };
};
