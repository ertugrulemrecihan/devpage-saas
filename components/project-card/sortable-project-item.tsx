import { Category, Project, ProjectStatus } from '@prisma/client';
import ProjectCard from './project-card';
import { useSortable } from '@dnd-kit/sortable';
import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SortableProjectItemProps {
  project: Project;
  cardVariant: 'horizontal' | 'big_image' | 'vertical';
  isPageEditing: boolean;
  categories?: Category[];
  projectStatus?: ProjectStatus[];
  setProjectEditChanges: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string | number | boolean | null | undefined;
    } | null>
  >;
  projectEditChanges?: {
    [key: string]: string | number | boolean | null | undefined;
  } | null;
  projectEditIsValid: boolean;
  changes?: { [key: string]: string };
  projectCardIsEditing?: {
    id: string;
    isEditing: boolean;
  };
  setProjectEditIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitProjectChanges: () => void;
  setProjectCardIsEditing?: React.Dispatch<
    React.SetStateAction<{ id: string; isEditing: boolean }>
  >;
  setProjects?: React.Dispatch<React.SetStateAction<Project[] | null>>;
  setChanges?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const SortableProjectItem = ({
  project,
  cardVariant,
  isPageEditing,
  categories,
  projectStatus,
  projectEditChanges,
  projectEditIsValid,
  changes,
  projectCardIsEditing,
  setProjectEditChanges,
  setProjectEditIsValid,
  onSubmitProjectChanges,
  setProjectCardIsEditing,
  setProjects,
  setChanges,
}: SortableProjectItemProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { attributes, listeners, setNodeRef } = useSortable({
    id: project.id,
    disabled: !isPageEditing && !projectCardIsEditing?.isEditing,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full relative"
      onMouseEnter={() => isPageEditing && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full overflow-hidden">
        <AnimatePresence>
          {isHovered && isPageEditing && !projectCardIsEditing?.isEditing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 z-50 w-full flex justify-center"
              {...attributes}
              {...listeners}
            >
              <div className="max-h-[20px] bg-[#CCC] rounded-b-lg flex flex-col gap-y-[2px] items-center justify-center gap-x-2 px-6 py-2">
                <div className="flex items-center gap-x-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                </div>
                <div className="flex items-center gap-x-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <ProjectCard
        key={project.id}
        variant={cardVariant}
        project={project}
        isPageEditing={isPageEditing}
        categories={categories}
        projectsStatus={projectStatus}
        onChange={(key, value) => {
          setProjectEditChanges({
            ...projectEditChanges!,
            id: project.id,
            [key]: value,
          });
          setProjectEditIsValid(false);
        }}
        onClose={() => {
          setProjectEditChanges(null);
        }}
        isValid={projectEditIsValid}
        onSubmit={onSubmitProjectChanges}
        setProjectCardIsEditing={setProjectCardIsEditing}
        changes={changes}
        setProjects={
          setProjects as React.Dispatch<React.SetStateAction<Project[] | null>>
        }
        setProjectCardHovered={setIsHovered}
      >
        <ProjectCard.Image
          projectsStatus={projectStatus}
          isPageEditing={isPageEditing}
          projectCardIsEditing={projectCardIsEditing}
          setProjects={
            setProjects as React.Dispatch<
              React.SetStateAction<Project[] | null>
            >
          }
        />
        <ProjectCard.Details
          categories={categories}
          projectCardIsEditing={projectCardIsEditing}
          onChange={(key, value) => {
            setProjectEditChanges({
              ...projectEditChanges!,
              id: project.id,
              [key]: value,
            });
            setProjectEditIsValid(false);
          }}
          setChanges={
            setChanges as React.Dispatch<
              React.SetStateAction<{ [key: string]: string }>
            >
          }
          isValid={projectEditIsValid}
        />
      </ProjectCard>
    </div>
  );
};

export default SortableProjectItem;
