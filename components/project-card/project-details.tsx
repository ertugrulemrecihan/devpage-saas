import { useProjectCardContext } from '@/contexts/project-card-context';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { IconCategory, IconCoin } from '@tabler/icons-react';
import { JetBrains_Mono } from 'next/font/google';

const font = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
});

interface ProjectCardProps {
  categories?: Category[];
}

const ProjectDetails = ({ categories }: ProjectCardProps) => {
  const { project } = useProjectCardContext();

  return (
    <div className="w-full h-full flex flex-col gap-y-3">
      <span className="font-medium text-base">{project.name}</span>
      <p className="font-normal text-sm text-[#666]">{project.description}</p>
      <div className="flex items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <IconCategory size={16} stroke={1.5} className="text-[#666]" />
          <span
            className={cn(font.className, 'font-normal text-xs text-[#666]')}
          >
            {
              categories?.find((category) => category.id === project.categoryId)
                ?.name
            }
          </span>
        </div>
        {project.revenue && project.revenue > 0 ? (
          <div className="flex items-center gap-x-1">
            <IconCoin size={16} stroke={1.5} className="text-[#666]" />
            <span
              className={cn(font.className, 'font-normal text-xs text-[#666]')}
            >
              {project.revenue?.toString()}/mo
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectDetails;
