import { db } from '@/lib/db';

export const getUserPageByUserId = async (id: string) => {
  try {
    const userPage = await db.userPage.findUnique({
      where: {
        userId: id,
      },
      include: {
        projects: true,
      },
    });

    return userPage;
  } catch {
    return null;
  }
};
