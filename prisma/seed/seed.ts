import { PrismaClient } from '@prisma/client';
import { categories, projectStatuses } from './dummyData';
const prisma = new PrismaClient();
async function main() {
  const dummyCategories = categories;
  const dummyProjectStatuses = projectStatuses;

  for (const category of dummyCategories) {
    await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });
  }

  for (const projectStatus of dummyProjectStatuses) {
    await prisma.projectStatus.create({
      data: {
        name: projectStatus.name,
        description: projectStatus.description,
      },
    });
  }

  console.log('DB seeded successfully! 🚀');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
