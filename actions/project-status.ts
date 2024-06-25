'use server';

import { db } from '@/lib/db';

export const fetchProjectStatus = async () => {
  const projectStatus = await db.projectStatus.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return { success: true, projectStatus };
};
