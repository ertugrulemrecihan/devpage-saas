import { useAppSelector } from '@/lib/rtk-hooks';
import { useEffect, useState } from 'react';

import DefaultImage from '@/public/assets/images/default-image.jpg';
import Image from 'next/image';

export const ProjectList = () => {
  const projects = useAppSelector((state) => state.projects);

  const [loadedProjects, setLoadedProjects] = useState(projects);

  useEffect(() => {
    setLoadedProjects(projects);
  }, [projects]);

  return (
    <div className="w-full space-y-2">
      {loadedProjects?.length === 0 && <p>No projects found!</p>}
      {loadedProjects?.map((project) => (
        <div
          key={project.id}
          className="w-full gap-5 flex items-center justify-between flex-row p-5 bg-white border border-[#E5E5E5] rounded-[12px] shadow-project-card"
        >
          <div className="w-14 h-14 relative">
            <Image
              src={project.image || DefaultImage}
              alt="Project Image"
              fill
              className="object-cover border-[1.56px] border-white rounded-[6.22px] shadow-project-image"
            />
          </div>
          <div className="flex-1 flex-row items-stretch">
            <div className="font-medium">{project.name}</div>
            <div className="text-[#64748B] text-sm">
              lorem ipsum dolet sit amet. lorem ipsum dolet sit amet
            </div>
          </div>
          <div className="flex items-start justify-center">
            <div className="bg-[#EEFBF4] rounded-[8px] px-2 py-1">
              <span className="text-[#17663A] text-sm">Active</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
