import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  username: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
  }
}
