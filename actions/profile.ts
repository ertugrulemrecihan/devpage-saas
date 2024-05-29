'use server';

import { db } from '@/lib/db';

export const checkUser = async (username: string) => {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      image: true,
      name: true,
      email: true,
      userPage: {
        select: {
          biography: true,
          location: true,
          backgroundStyle: true,
          projectCardsStyle: true,
          socialMediaLinksStyle: true,
          socialMediaLinks: true,
          contactEmail: true,
          projects: {
            select: {
              image: true,
              name: true,
              description: true,
              category: {
                select: {
                  name: true,
                },
              },
              status: {
                select: {
                  name: true,
                },
              },
              url: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return { error: 'User not found!' };
  }

  return { success: true, user };
};
