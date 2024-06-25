'use server';

import { db } from '@/lib/db';

export const fetchCategories = async () => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return { success: true, categories };
};
