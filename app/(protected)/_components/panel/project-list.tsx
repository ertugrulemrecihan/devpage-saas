import { useAppSelector } from '@/lib/rtk-hooks';
import { useEffect, useState } from 'react';

export const ProjectList = () => {
  const projects = useAppSelector((state) => state.projects);

  const [loadedProjects, setLoadedProjects] = useState(projects);

  useEffect(() => {
    setLoadedProjects(projects);
  }, [projects]);

  return (
    <div>
      {loadedProjects?.length === 0 && <p>No projects found!</p>}
      {loadedProjects?.map((project) => (
        <p key={project.id}>{project.name}</p>
      ))}
    </div>
  );
};
