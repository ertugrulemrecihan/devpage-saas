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

const UserForProfile = Prisma.validator<Prisma.UserArgs>()({
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

export type UserForProfile = Prisma.UserGetPayload<typeof UserForProfile>;

export type ProfileBackgroundColorsType = {
  [key: string]: {
    backgroundColor: string;
    borderColors: { from: string; to: string };
  };
};

export type UsernameSession = {
  username?: string;
};
