import { Prisma } from '@prisma/client';

const userWithUserPage = Prisma.validator<Prisma.UserArgs>()({
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

export type UserWithUserPage = Prisma.UserGetPayload<typeof userWithUserPage>;

const ProjectWithOthers = Prisma.validator<Prisma.ProjectArgs>()({
  select: {
    id: true,
    name: true,
    image: true,
    description: true,
  },
});

export type ProjectWithOthers = Prisma.ProjectGetPayload<
  typeof ProjectWithOthers
>;
