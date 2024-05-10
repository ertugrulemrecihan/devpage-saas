import { Category, Prisma, ProjectStatus } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

export const categories: Category[] = [
  {
    id: null as unknown as string,
    name: '🤖 Artificial Intelligence',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '✍️ Productivity',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '📚 Education',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🐲, No Code',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '💬 Social Media',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🛍️ E-Commerce',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '📈 Analytics',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🦇 Web 3',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '👓 Design Tools',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🧑‍💻 Developer Tools',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '📊 Marketing',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '💰 Finance',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🔮 Others',
    description: null,
  },
];

export const projectStatuses: ProjectStatus[] = [
  {
    id: null as unknown as string,
    name: '🏗️ Building...',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🟢 Active',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '☕️ On hold',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '🤝 For Sale',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '💰 Acquired',
    description: null,
  },
  {
    id: null as unknown as string,
    name: '❌ Discontinued',
    description: null,
  },
];
