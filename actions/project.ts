'use server';

import * as z from 'zod';
import { CreateProjectSchema, ProjectEditSchema } from '@/schemas';
import {
  getUserById,
  getUserByIdWithUserPage,
  getUserByUsername,
} from '@/data/user';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getUserPageByUserId } from '@/data/user-page';
import { ClientUploadedFileData } from 'uploadthing/types';
import { UTApi } from 'uploadthing/server';
import { connect } from 'http2';

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

export const createProject = async (
  values: z.infer<typeof CreateProjectSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserByIdWithUserPage(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const validatedFields = CreateProjectSchema.safeParse(values);

  const categoryId = validatedFields.data?.category;
  const projectStatusId = validatedFields.data?.project_status;

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const userPage = await getUserPageByUserId(user.id as string);

  if (!userPage) {
    return { error: 'Failed to create project!' };
  }

  const createdProject = await db.project.create({
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      image: '',
      url: validatedFields.data.url,
      categoryId,
      statusId: projectStatusId,
      revenue: parseFloat(validatedFields.data.revenue as string),
      userPageId: userPage.id,
    },
  });

  if (!createdProject) {
    return { error: 'Failed to create project!' };
  }

  return { project: createdProject, success: 'Saved! ✅' };
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

export const updateProjectImage = async (
  res: ClientUploadedFileData<{
    uploadedBy: string | undefined;
  }>[],
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

  const utapi = new UTApi();

  const currentProject = await db.project.findUnique({
    where: {
      id: project_id,
    },
    select: {
      image: true,
    },
  });

  if (!currentProject) {
    return { error: 'Project not found!' };
  }

  if (currentProject.image) {
    const projectImage = currentProject.image.split('/').pop();

    if (projectImage) {
      await utapi.deleteFiles(projectImage);
    }
  }

  const updatedProject = await db.project.update({
    where: {
      id: project_id,
    },
    data: {
      image: res[0].url,
    },
  });

  return { success: 'Saved! ✅', project: updatedProject };
};

export const deleteProject = async (project_id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Unauthorized!' };
  }

  const currentProject = await db.project.findUnique({
    where: {
      id: project_id,
    },
    select: {
      image: true,
    },
  });

  if (!currentProject) {
    return { error: 'Project not found!' };
  }

  const utapi = new UTApi();

  if (currentProject.image) {
    const projectImage = currentProject.image.split('/').pop();

    if (projectImage) {
      await utapi.deleteFiles(projectImage);
    }
  }

  const deletedProject = await db.project.delete({
    where: {
      id: project_id,
    },
  });

  return { success: 'Deleted! ❌', project: deletedProject };
};
