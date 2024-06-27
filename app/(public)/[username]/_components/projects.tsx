import { CreateProjectSchema, ProjectEditSchema } from '@/schemas';
import { useAppSelector } from '@/lib/rtk-hooks';
import { ProjectEditChangesProps } from '@/types';
import { fetchCategories } from '@/actions/category';
import { notFound, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useRef, useState, useTransition } from 'react';
import { fetchProjectStatus } from '@/actions/project-status';
import { Category, Project, ProjectStatus } from '@prisma/client';
import {
  fetchProjects,
  updateProject,
  createProject as createProjectServer,
} from '@/actions/project';

import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from '@/components/project-card';
import ProjectCardSkeleton from '@/components/project-card/project-card-skeleton';

import RefreshIcon from '@/public/assets/icons/refresh';

const Projects = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);
  const profileUser = useAppSelector((state) => state.profile.user);

  const currentUser = useCurrentUser();

  const params = useParams();
  const username = params.username;

  const addProjectCardRef = useRef<HTMLDivElement>(null);

  const [projects, setProjects] = useState<Project[] | null>();
  const [categories, setCategories] = useState<Category[] | undefined>();
  const [projectEditIsValid, setProjectEditIsValid] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAddingProject, setIsAddingProject] = useState<
    | boolean
    | {
        id: string;
        isEditing: boolean;
      }
  >(false);
  const [projectEditChanges, setProjectEditChanges] =
    useState<ProjectEditChangesProps | null>();
  const [projectStatus, setProjectStatus] = useState<
    ProjectStatus[] | undefined
  >();
  const [projectCardIsEditing, setProjectCardIsEditing] = useState<{
    id: string;
    isEditing: boolean;
  }>({
    id: '',
    isEditing: false,
  });
  const [changes, setChanges] = useState<{ [key: string]: string }>();
  const [createProject, setCreateProject] = useState<{
    [key: string]: string;
  } | null>(null);
  const [createProjectIsValid, setCreateProjectIsValid] =
    useState<boolean>(false);

  const [isPending, startFetchProjectsTransition] = useTransition();
  const [isProjectUpdatePending, startUpdateProjectTransition] =
    useTransition();
  const [isCreateProjectPending, startCreateProjectTransition] =
    useTransition();

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);

  useEffect(() => {
    if (isAddingProject) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          addProjectCardRef.current &&
          !addProjectCardRef.current.contains(e.target as Node)
        ) {
          setIsAddingProject(false);
          setCreateProject(null);
          setCreateProjectIsValid(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isAddingProject]);

  const getProjects = async () => {
    startFetchProjectsTransition(async () => {
      await fetchProjects(username as string).then((data) => {
        if (data.error) {
          return notFound();
        }

        if (data.success) {
          setProjects(data.projects);
        }
      });
    });
  };

  const getCategories = async () => {
    startFetchProjectsTransition(async () => {
      await fetchCategories().then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      });
    });
  };

  const getProjectStatus = async () => {
    startFetchProjectsTransition(async () => {
      await fetchProjectStatus().then((data) => {
        if (data.success) {
          setProjectStatus(data.projectStatus);
        }
      });
    });
  };

  useEffect(() => {
    getProjects();
    getCategories();
    getProjectStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const onSubmitProjectChanges = async () => {
    if (!projectEditChanges) return;

    const { id, ...changes } = projectEditChanges;

    const validatedValues = ProjectEditSchema.safeParse(changes);

    if (validatedValues.success) {
      setProjectEditIsValid(true);

      startUpdateProjectTransition(async () => {
        await updateProject(validatedValues.data, id).then((data) => {
          if (data.error) {
            toast({
              title: 'Error!',
              description: data.error,
              variant: 'error',
              duration: 2000,
            });
          }

          if (data.success) {
            toast({
              title: 'Success!',
              description: data.success,
              variant: 'success',
              duration: 2000,
            });

            setProjectEditChanges(null);

            setProjects((prevProjects) => {
              if (!prevProjects) return;

              return prevProjects.map((project) => {
                if (project.id === id) {
                  return {
                    ...data.project,
                  };
                }

                return project;
              });
            });
          }
        });
      });
    }

    if (validatedValues.error) {
      toast({
        title: 'Error!',
        description: validatedValues.error.issues[0].message,
        variant: 'error',
        duration: 2000,
      });
    }
  };

  const onSubmitCreateProject = async () => {
    if (!createProject) return;

    const validatedValues = CreateProjectSchema.safeParse(createProject);

    if (validatedValues.success) {
      setCreateProjectIsValid(true);
      setCreateProject(null);
      setIsAddingProject(false);

      startCreateProjectTransition(async () => {
        createProjectServer(validatedValues.data).then((data) => {
          if (data.error) {
            toast({
              title: 'Error!',
              description: data.error,
              variant: 'error',
              duration: 2000,
            });
          }

          if (data.success) {
            toast({
              title: 'Success!',
              description: data.success,
              variant: 'success',
              duration: 2000,
            });

            setProjects((prevProjects) => {
              if (!prevProjects) return;

              return [...prevProjects, data.project];
            });
          }
        });
      });
    }

    if (validatedValues.error) {
      toast({
        title: 'Error!',
        description: validatedValues.error.issues[0].message,
        variant: 'error',
        duration: 2000,
      });
    }
  };

  if (isPending) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex gap-x-5"
        >
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div>
        <AnimatePresence>
          {isPageEditing && isOwner && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-x-1 pb-6">
                <Button
                  variant="ghost"
                  className="px-2 py-[0.375rem] flex items-center gap-2"
                  onClick={() => {
                    setIsAddingProject(true);
                  }}
                >
                  <span className="text-sm text-[#666] font-normal">
                    Add Project
                  </span>
                  <IconPlus size={18} className="text-[#666]" />
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-[0.375rem] flex items-center gap-2"
                >
                  <span className="text-sm text-[#666] font-normal">Style</span>
                  <RefreshIcon />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full grid grid-cols-2 md:justify-start justify-center gap-5 transition-all duration-300 pb-6"
      >
        <AnimatePresence>
          {isAddingProject && isPageEditing && isOwner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={addProjectCardRef}
            >
              <ProjectCard
                variant="horizontal"
                isPageEditing={isPageEditing}
                categories={categories}
                projectsStatus={projectStatus}
                onChange={(key, value) => {
                  setCreateProject({
                    ...createProject,
                    [key]: value,
                  });
                }}
                onClose={() => {
                  setCreateProject(null);
                  setCreateProjectIsValid(false);
                }}
                isValid={createProjectIsValid}
                onSubmit={onSubmitCreateProject}
                isAddProjectCard={true}
                changes={createProject as { [key: string]: string }}
              >
                <ProjectCard.Image
                  projectsStatus={projectStatus}
                  isPageEditing={isPageEditing}
                  projectCardIsEditing={{ id: '', isEditing: true }}
                  isAddProjectCard={true}
                />

                <ProjectCard.Details
                  categories={categories}
                  projectCardIsEditing={{ id: '', isEditing: true }}
                  onChange={(key, value) => {
                    setCreateProject({
                      ...createProject,
                      [key]: value,
                    });
                  }}
                  isValid={createProjectIsValid}
                />
              </ProjectCard>
            </motion.div>
          )}
        </AnimatePresence>

        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            variant="horizontal"
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
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;
