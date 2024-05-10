import { Prisma } from '@prisma/client';

const userWithUserPage = Prisma.validator<Prisma.UserArgs>()({
  include: {
    userPage: {
      select: {
        biography: true,
        location: true,
      },
    },
  },
});

export type UserWithUserPage = Prisma.UserGetPayload<typeof userWithUserPage>;
