import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  errorRoutes,
  privateRoutes,
} from '@/routes';
import { NextRequest } from 'next/server';
import { currentUser } from './lib/auth';

export async function middleware(req: NextRequest) {
  const user = await currentUser();

  const { nextUrl } = req;
  const isLoggedIn = !!user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isErrorRoute = errorRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isUserDetailPage = nextUrl.pathname.match('/(.*)');

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(`/${user.username}`, nextUrl));
    }

    return null;
  }

  if (isErrorRoute) {
    return null;
  }

  if (!isLoggedIn && !isPublicRoute && isPrivateRoute) {
    if (isUserDetailPage && !isPrivateRoute) {
      return null;
    }

    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
