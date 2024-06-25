import { Project } from '@prisma/client';
import { createContext, useContext } from 'react';

type ProjectCardContextType = {
  project: Project;
  variant: 'horizontal' | 'big_image' | 'vertical';
  isPageEditing: boolean;
};

const ProjectCardContext = createContext<ProjectCardContextType | null>(null);

export function useProjectCardContext() {
  const context = useContext(ProjectCardContext);

  if (!context)
    throw new Error(
      'ProjectCard.* component must be rendered as child of ProjectCard component.'
    );

  return context;
}

export default ProjectCardContext;
