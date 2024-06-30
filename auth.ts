import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';
import { getAccountByUserId } from './data/account';
import {
  clearUsernameSession,
  fetchUsernameInSession,
} from './actions/register';
import { getUserPageByUserId } from './data/user-page';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
    async signIn(message) {
      if (message.user) {
        const userPage = await getUserPageByUserId(message.user.id as string);

        if (!userPage) {
          await db.userPage.create({
            data: {
              user: {
                connect: {
                  id: message.user.id,
                },
              },
            },
          });

          await clearUsernameSession();
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserById(user.id as string);

      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') {
        const sessionUsername = await fetchUsernameInSession();

        if (!existingUser && !sessionUsername.username) {
          return '/auth/login?error=AccountNotFound';
        }

        if (!sessionUsername) return false;

        user.username = sessionUsername.username as string;

        return true;
      }

      if (existingUser) {
        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.username = existingUser.username;
      token.email = existingUser.email;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
