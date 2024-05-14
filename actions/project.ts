'use server';

import * as z from 'zod';
import { ProjectSchema } from '@/schemas';
import { getUserByIdWithUserPage } from '@/data/user';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getUserPageByUserId } from '@/data/user-page';

export const fetchProjects = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserByIdWithUserPage(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const userPage = await getUserPageByUserId(user.id as string);

  if (!userPage) {
    return { error: 'Failed to fetch projects!' };
  }

  const projects = await db.userPage
    .findUnique({
      where: {
        id: userPage.id,
      },
    })
    .projects({
      select: {
        id: true,
        image: true,
        description: true,
        name: true,
      },
    });

  return { projects, success: true };
};

export const createProject = async (values: z.infer<typeof ProjectSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserByIdWithUserPage(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const validatedFields = ProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const userPage = await getUserPageByUserId(user.id as string);

  if (!userPage) {
    return { error: 'Failed to create project!' };
  }

  const createdProject = await db.userPage
    .update({
      where: {
        id: userPage?.id,
      },
      data: {
        projects: {
          create: {
            name: validatedFields.data.name,
          },
        },
      },
    })
    .projects({
      select: {
        id: true,
        image: true,
        description: true,
        name: true,
      },
    });

  if (!createdProject) {
    return { error: 'Failed to create project!' };
  }

  return { project: createdProject };
};
