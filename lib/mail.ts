import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;
const fromEmail = process.env.RESEND_FROM_EMAIL as string;

export const sendVerificationEmail = async (
  email: string,
  token: string,
  callbackUrl?: string
) => {
  let confirmLink = `${domain}/auth/new-verification?token=${token}`;

  if (callbackUrl) {
    confirmLink += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
