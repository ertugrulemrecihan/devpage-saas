'use server';

import * as z from 'zod';
import { UserPageDetailsSchema } from '@/schemas';
import { getUserByIdWithUserPage } from '@/data/user';
import { db } from '@/lib/db';

export const getUserAllPageDetail = async (id: string) => {
  const user = await getUserByIdWithUserPage(id);

  if (!user) {
    return {
      error: 'Unauthorized!',
    };
  }

  if (!user.userPage) {
    const userPage = await db.userPage.create({
      data: {
        userId: user.id,
      },
    });

    user.userPage = userPage;
  }

  return { user };
};

export const updateUserPageDetails = async (
  id: string,
  data: z.infer<typeof UserPageDetailsSchema>
) => {
  try {
    const user = await getUserByIdWithUserPage(id);

    if (!user) {
      return {
        error: 'Unauthorized!',
      };
    }

    let userPageData = {};

    if (data.biography === undefined && data.location !== undefined) {
      userPageData = {
        location: data.location,
      };
    } else if (data.biography !== undefined && data.location === undefined) {
      userPageData = {
        biography: data.biography,
      };
    } else if (data.biography !== undefined && data.location !== undefined) {
      userPageData = {
        biography: data.biography,
        location: data.location,
      };
    } else {
      userPageData = {};
    }

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
      include: {
        userPage: {
          select: {
            biography: true,
            location: true,
          },
        },
      },
    });

    return { user: updatedUser, success: 'Saved! ✅' };
  } catch {
    return null;
  }
};
