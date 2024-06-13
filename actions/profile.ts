'use server';

import * as z from 'zod';
import { getUserByIdWithUserPage } from '@/data/user';
import { db } from '@/lib/db';
import { SocialLinksSchema, UserPageDetailsSchema } from '@/schemas';
import { currentUser } from '@/lib/auth';
import { BACKGROUND_STYLE } from '@prisma/client';

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
          socialMediaLinks: {
            select: {
              type: true,
              username: true,
            },
          },
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
            socialMediaLinks: {
              select: {
                id: true,
                type: true,
                username: true,
              },
            },
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

export const createOrUpdateSocialMediaLink = async (
  id: string,
  data: z.infer<typeof SocialLinksSchema>
) => {
  const sessionUser = await currentUser();

  if (sessionUser?.id !== id) {
    return {
      error: 'Unauthorized!',
    };
  }

  const userPage = await db.userPage.findUnique({
    where: { userId: id },
    select: {
      id: true,
      socialMediaLinks: {
        select: {
          id: true,
          type: true,
          username: true,
        },
      },
    },
  });

  if (!userPage) {
    return {
      error: 'Unauthorized!',
    };
  }

  const linkProvider = Object.keys(data)[0];

  const socialMediaLink = userPage.socialMediaLinks.find(
    (link) => link.type === linkProvider
  );

  const username = Object.values(data)[0];

  if (socialMediaLink && username) {
    await db.socialMediaLink.update({
      where: { id: socialMediaLink.id, userPageId: userPage.id },
      data: {
        username,
      },
    });
  }

  if (!username && socialMediaLink) {
    await db.socialMediaLink.delete({
      where: { id: socialMediaLink.id },
    });
  }

  if (!socialMediaLink && username) {
    await db.socialMediaLink.create({
      data: {
        type: linkProvider,
        username,
        userPageId: userPage.id,
      },
    });
  }

  const updatedUserPage = await db.userPage.findUnique({
    where: { userId: id },
    select: {
      id: true,
      biography: true,
      location: true,
      contactEmail: true,
      socialMediaLinks: {
        select: {
          id: true,
          type: true,
          username: true,
        },
      },
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
  });

  return { success: 'Saved! ✅', userPage: updatedUserPage };
};

export const updateUserPageBackgroundStyle = async (
  backgroundStyle: string
) => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return {
      error: 'Unauthorized!',
    };
  }

  const userPage = await db.userPage.findUnique({
    where: { userId: sessionUser.id },
    select: {
      id: true,
      backgroundStyle: true,
    },
  });

  if (!userPage) {
    return {
      error: 'Unauthorized!',
    };
  }

  const styleName = Object.entries(backgroundStyle)[0][1].toUpperCase();

  await db.userPage.update({
    where: { id: userPage.id, userId: sessionUser.id },
    data: {
      backgroundStyle: {
        set: styleName as BACKGROUND_STYLE,
      },
    },
  });

  return { success: 'Saved! ✅' };
};
