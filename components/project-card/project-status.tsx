import { useProjectCardContext } from '@/contexts/project-card-context';
import { cn } from '@/lib/utils';
import { ProjectStatus as ProjectsStatus } from '@prisma/client';
import { useEffect, useState } from 'react';

interface ProjectStatusProps {
  projectsStatus?: ProjectsStatus[];
}

interface StatusVariants {
  [key: string]: {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
    emoji: string;
  };
}

const ProjectStatus = ({ projectsStatus }: ProjectStatusProps) => {
  const [statusVariant, setStatusVariant] = useState<string>('');
  const [currentProjectStatus, setCurrentProjectStatus] =
    useState<ProjectsStatus | null>(null);

  const { project } = useProjectCardContext();

  useEffect(() => {
    if (project) {
      projectsStatus?.map((status) => {
        if (status.id === project.statusId) {
          setCurrentProjectStatus(status);
          setStatusVariant(
            status.name
              .replace(' ', '_')
              .replace('...', '')
              .toLowerCase()
              .trim()
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const statusVariants: StatusVariants = {
    building: {
      borderColor: '#E5E5E5',
      backgroundColor: '#F1F1F1',
      textColor: '#1A1A1A',
      emoji: '🚧',
    },
    active: {
      borderColor: '#DCFCE7',
      backgroundColor: '#F0FDF4',
      textColor: '#166534',
      emoji: '🟢',
    },
    on_hold: {
      borderColor: '#FFEDD5',
      backgroundColor: '#FFF7ED',
      textColor: '#9A3412',
      emoji: '⏳',
    },
    for_sale: {
      borderColor: '#DCFCE7',
      backgroundColor: '#F0FDF4',
      textColor: '#166534',
      emoji: '🤝',
    },
    purchased: {
      borderColor: '#F3E8FF',
      backgroundColor: '#FAF5FF',
      textColor: '#6B21A8',
      emoji: '🤑',
    },
    discontinued: {
      borderColor: '#FEE2E2',
      backgroundColor: '#FEF2F2',
      textColor: '#991B1B',
      emoji: '❌',
    },
  };

  return (
    statusVariant && (
      <div className="h-full">
        <div
          className={cn('flex items-center py-1 px-2 rounded-lg gap-x-1')}
          style={{
            background: statusVariants[statusVariant].backgroundColor,
            border: `1px solid ${statusVariants[statusVariant].borderColor}`,
            borderColor: statusVariants[statusVariant].borderColor,
          }}
        >
          <div className="flex items-center gap-x-1">
            <span className="font-normal text-sm">
              {statusVariants[statusVariant].emoji}
            </span>
            <span
              className="font-normal text-sm text-nowrap"
              style={{
                color: statusVariants[statusVariant].textColor,
              }}
            >
              {currentProjectStatus?.name}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default ProjectStatus;
