'use server';

import { db } from '@/lib/db';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { ClientUploadedFileData } from 'uploadthing/types';
import { UTApi } from 'uploadthing/server';

export const changeProfilePhoto = async (
  res: ClientUploadedFileData<{
    uploadedBy: string | undefined;
  }>[]
) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  if (!res[0]) {
    return { error: 'No file uploaded!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const utapi = new UTApi();

  if (dbUser.image) {
    const userImage = dbUser.image.split('/').pop();

    if (userImage) {
      await utapi.deleteFiles(userImage);
    }
  }

  const updatedUser = await db.user.update({
    where: { id: user.id as string },
    data: {
      image: res[0].url,
    },
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

  return { success: 'Profile photo updated!', user: updatedUser };
};

export const deleteProfilePhoto = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  if (!dbUser.image) {
    return { error: 'No image to delete!' };
  }

  const utapi = new UTApi();

  const userImage = dbUser.image.split('/').pop();

  if (userImage) {
    await utapi.deleteFiles(userImage);
  }

  const updatedUser = await db.user.update({
    where: { id: user.id as string },
    data: {
      image: null,
    },
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

  return { success: 'Profile photo deleted!', user: updatedUser };
};
