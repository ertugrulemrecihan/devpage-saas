import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByIdWithUserPage = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
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
                status: true,
                statusId: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
};
