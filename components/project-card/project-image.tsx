import { useProjectCardContext } from '@/contexts/project-card-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import DefaultImage from '@/public/assets/images/default-image.jpg';
import { ProjectStatus as ProjectsStatus } from '@prisma/client';
import ProjectStatus from './project-status';

interface ProjectImageProps {
  projectsStatus?: ProjectsStatus[];
}

const ProjectImage = ({ projectsStatus }: ProjectImageProps) => {
  const { variant, project } = useProjectCardContext();

  return (
    <div
      className={cn(
        'h-full flex justify-between',
        variant === 'vertical' && 'w-full'
      )}
    >
      <div
        className={cn(
          'relative rounded-md border-[1.56px] border-white overflow-hidden shadow-project-image',
          variant !== 'big_image' && 'w-[3.5rem] h-[3.5rem]',
          variant === 'big_image' && 'w-[8rem] h-[8rem]'
        )}
      >
        <Image
          src={project.image || DefaultImage}
          alt={project.name}
          layout="fill"
          className="object-cover"
        />
      </div>
      {variant === 'vertical' && (
        <ProjectStatus projectsStatus={projectsStatus} />
      )}
    </div>
  );
};

export default ProjectImage;
