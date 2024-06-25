'use server';

import * as z from 'zod';
import { ProjectEditSchema, ProjectSchema } from '@/schemas';
import {
  getUserById,
  getUserByIdWithUserPage,
  getUserByUsername,
} from '@/data/user';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getUserPageByUserId } from '@/data/user-page';

export const fetchProjects = async (username: string) => {
  const dbUser = await getUserByUsername(username);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const userPage = await getUserPageByUserId(dbUser.id as string);

  if (!userPage) {
    return { error: 'Failed to fetch projects!' };
  }

  const projects = await db.userPage.findUnique({
    where: {
      id: userPage.id,
      userId: dbUser.id,
    },
    select: {
      projects: true,
    },
  });

  return { success: true, projects: projects?.projects };
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

export const updateProject = async (
  data: z.infer<typeof ProjectEditSchema>,
  project_id: string
) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const validatedFields = ProjectEditSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  let revenue = undefined;

  if (validatedFields.data.revenue) {
    revenue = parseFloat(validatedFields.data.revenue as string);
  }

  const userPage = await getUserPageByUserId(user.id as string);

  if (!userPage) {
    return { error: 'Failed to update project!' };
  }

  const updatedProject = await db.project.update({
    where: {
      id: project_id,
    },
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      image: validatedFields.data.image,
      url: validatedFields.data.url,
      categoryId: validatedFields.data.category,
      statusId: validatedFields.data.project_status,
      revenue,
    },
  });

  if (!updatedProject) {
    return { error: 'Failed to update project!' };
  }

  return { project: updatedProject, success: 'Saved! ✅' };
};
