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
            size: true,
            statusIsVisible: true,
            status: true,
            statusId: true,
          },
        },
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
                size: true,
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
  } catch {
    return null;
  }
};
