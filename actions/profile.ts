'use server';

import * as z from 'zod';
import { getUserByIdWithUserPage } from '@/data/user';
import { db } from '@/lib/db';
import { UserPageDetailsSchema } from '@/schemas';
import { currentUser } from '@/lib/auth';

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

export const updateUserPageDetails = async (
  id: string,
  data: z.infer<typeof UserPageDetailsSchema>
) => {
  try {
    const sessionUser = await currentUser();

    if (sessionUser?.id !== id) {
      return {
        error: 'Unauthorized!',
      };
    }

    const user = await getUserByIdWithUserPage(id);

    if (!user) {
      return {
        error: 'Unauthorized!',
      };
    }

    let userPageData = {
      biography: data.biography,
      location: data.location,
      contactEmail: data.contactEmail,
    };

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name: data.name,
        userPage: {
          update: {
            ...userPageData,
          },
        },
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

    return { user: updatedUser, success: 'Saved! ✅' };
  } catch {}
};
