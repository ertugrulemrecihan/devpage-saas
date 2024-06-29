import { cn } from '@/lib/utils';
import { ProjectEditChangesProps } from '@/types';
import { useAutoSave } from '@/hooks/use-auto-save';
import { fetchCategories } from '@/actions/category';
import { notFound, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetchProjectStatus } from '@/actions/project-status';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { CreateProjectSchema, ProjectEditSchema } from '@/schemas';
import { updateUserPageProjectCardsStyle } from '@/actions/profile';
import {
  Category,
  PROJECT_CARD_STYLE,
  Project,
  ProjectStatus,
} from '@prisma/client';
import {
  fetchProjects,
  updateProject,
  createProject as createProjectServer,
  updateProjectsIndex,
} from '@/actions/project';
import {
  setEditingMode,
  setProfileUser,
} from '@/lib/features/profile/profileSlice';

import { IconPlus, IconWand } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from '@/components/project-card';
import ProjectCardSkeleton from '@/components/project-card/project-card-skeleton';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimation,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import RefreshIcon from '@/public/assets/icons/refresh';
import SortableProjectItem from '@/components/project-card/sortable-project-item';

const Projects = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);
  const profileUser = useAppSelector((state) => state.profile.user);

  const dispatch = useAppDispatch();

  const currentUser = useCurrentUser();

  const projectCardStyles = ['horizontal', 'vertical', 'big_image'];

  const params = useParams();
  const username = params.username;

  const addProjectCardRef = useRef<HTMLDivElement>(null);

  const [cardVariantIndex, setCardVariantIndex] = useState<number>(0);
  const [cardVariant, setCardVariant] = useState<
    'horizontal' | 'vertical' | 'big_image'
  >('horizontal');
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
  const [projectCardStyleChangeTimer, setProjectCardStyleChangeTimer] =
    useState<number | NodeJS.Timeout>(500);
  const [projectIndexUpdateTimer, setProjectIndexUpdateTimer] = useState<
    number | NodeJS.Timeout
  >(500);

  // ? Drag and Drop Configuration
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'unique-id',
    disabled: !isPageEditing,
  });
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const [isPending, startFetchProjectsTransition] = useTransition();
  const [isProjectUpdatePending, startUpdateProjectTransition] =
    useTransition();
  const [isCreateProjectPending, startCreateProjectTransition] =
    useTransition();

  useEffect(() => {
    if (profileUser) {
      const projectCardStyle =
        profileUser.userPage?.projectCardsStyle.toLowerCase() as
          | 'horizontal'
          | 'vertical'
          | 'big_image';
      setCardVariant(projectCardStyle);
      setCardVariantIndex(projectCardStyles.indexOf(projectCardStyle));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser]);

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

  useEffect(() => {
    const cardVariant = projectCardStyles[cardVariantIndex] as
      | 'horizontal'
      | 'vertical'
      | 'big_image';

    setCardVariant(cardVariant);

    clearTimeout(projectCardStyleChangeTimer);

    if (
      cardVariant ===
      (profileUser?.userPage?.projectCardsStyle.toLowerCase() as
        | 'horizontal'
        | 'vertical'
        | 'big_image')
    ) {
      return;
    } else {
      const timer = setTimeout(() => {
        dispatchProjectCardAutoSave({});
      }, 500);
      setProjectCardStyleChangeTimer(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardVariantIndex]);

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

  const updateProjectCardStyle = async () => {
    if (currentUser && isOwner) {
      const style = projectCardStyles[cardVariantIndex] as
        | 'horizontal'
        | 'vertical'
        | 'big_image';

      dispatch(
        setProfileUser({
          ...profileUser!,
          userPage: {
            ...profileUser?.userPage!,
            projectCardsStyle: style.toUpperCase() as PROJECT_CARD_STYLE,
          },
        })
      );

      await updateUserPageProjectCardsStyle(style).then((response) => {
        if (response?.error) {
          return toast({
            title: 'Error!',
            description: response.error,
            variant: 'error',
            duration: 2000,
          });
        }

        if (response?.success) {
          toast({
            title: 'Success!',
            description: response.success,
            variant: 'success',
            duration: 2000,
          });
        }
      });
    }
  };

  const { dispatchAutoSave: dispatchProjectCardAutoSave } = useAutoSave({
    onSave: updateProjectCardStyle,
  });

  // Drag and Drop
  const getProjectPos = (id: string) => {
    return projects?.findIndex((project) => project.id === id);
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    let newProjects = projects;

    setProjects((prevProjects) => {
      if (!prevProjects) return;

      const oldIndex = getProjectPos(active.id as string);
      const newIndex = getProjectPos(over?.id as string);

      if (oldIndex === undefined || newIndex === undefined) return;

      newProjects = arrayMove(prevProjects, oldIndex, newIndex);

      return newProjects;
    });

    const ProjectIds = newProjects?.map((project) => project.id);

    const ProjectsIndexWithId = ProjectIds?.map((id) => {
      return { id: id, index: ProjectIds.indexOf(id) };
    });

    clearTimeout(projectIndexUpdateTimer);

    const timer = setTimeout(async () => {
      await updateProjectsIndex(ProjectsIndexWithId).then((data) => {
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
        }
      });
    }, 2000);

    setProjectIndexUpdateTimer(timer);
  };

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

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
                  onClick={() => {
                    setCardVariantIndex((prev) => (prev + 1) % 3);
                  }}
                >
                  <span className="text-sm text-[#666] font-normal">Style</span>
                  <motion.div
                    initial={{ rotate: cardVariantIndex * -90 }}
                    animate={{ rotate: cardVariantIndex * -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RefreshIcon />
                  </motion.div>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {projects &&
        projects?.length === 0 &&
        !isPageEditing &&
        !isAddingProject && (
          <div className="w-full flex items-center justify-center mt-[5%]">
            <div className="w-full h-full flex flex-col items-center justify-center gap-y-[27px]">
              <div className="min-w-[29.5rem] relative min-h-[12.875rem]">
                <div
                  className="absolute top-[10.11px] rotate-[3.18deg] w-[20.675rem] h-[6.161rem] bg-white border border-[#E5E5E5] rounded-[5.4px] flex items-center justify-center p-[13.5px] ml-[75.11px]"
                  style={{
                    boxShadow:
                      '0px 0.698px 26.302px 0px rgba(16, 24, 40, 0.02)',
                  }}
                >
                  <div className="w-full h-full flex items-start justify-between">
                    <div className="w-[37.81px] h-[37.81px] bg-[#F1F1F1] rounded-sm"></div>
                    <div className="flex flex-col gap-y-[8.1px]">
                      <div className="w-[189.03px] h-[14.85px] bg-[#E5E5E5] rounded-sm"></div>
                      <div className="w-[189.03px] h-[29.7px] bg-[#F1F1F1] rounded-sm"></div>
                      <div className="w-[93.17px] h-[10.8px] bg-[#F1F1F1] rounded-sm"></div>
                    </div>
                    <div className="w-[49.96px] h-[18.9px] bg-[#F1F1F1] rounded-sm"></div>
                  </div>
                </div>
                <div
                  className="absolute top-[45.58px] rotate-[6.43deg] w-[13.452rem] h-[9.295rem] bg-white border border-[#E5E5E5] rounded-[5.4px] flex items-center justify-center p-[13.45px] ml-[248.65px]"
                  style={{
                    boxShadow: '0px -8.33px 25.35px 0px rgba(16, 24, 40, 0.04)',
                  }}
                >
                  <div className="w-full h-full flex flex-col gap-y-[13.45px]">
                    <div className="flex justify-between">
                      <div className="w-[37.07px] h-[37.07px] bg-[#F1F1F1] rounded-sm"></div>
                      <div className="w-[49.96px] h-[18.9px] bg-[#F1F1F1] rounded-sm"></div>
                    </div>
                    <div className="flex flex-col gap-y-[8.07px]">
                      <div className="w-[188.33px] h-[14.8px] bg-[#F1F1F1] rounded-sm"></div>
                      <div className="w-[188.33px] h-[29.59px] bg-[#F1F1F1] rounded-sm"></div>
                      <div className="w-[188.33px] h-[10.8px] bg-[#E5E5E5] rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <div
                  className="absolute top-[54.15px] rotate-[-3.6deg] w-[21.371rem] h-[7.328rem] bg-white border border-[#E5E5E5] rounded-[5.4px] flex items-center justify-center p-[13.96px] ml-[3.34px]"
                  style={{
                    boxShadow: '0px 2.77px 26.302px 0px rgba(16, 24, 40, 0.04)',
                  }}
                >
                  <div className="w-full h-full flex items-start justify-between gap-x-[13.96px]">
                    <div className="w-[89.32px] h-[89.32px] bg-[#F1F1F1] rounded-sm"></div>
                    <div className="flex flex-col gap-y-[8.37px]">
                      <div className="w-[150.73px] h-[30.71px] bg-[#F1F1F1] rounded-sm"></div>
                      <div className="w-[150.73px] h-[30.71px] bg-[#E5E5E5] rounded-sm"></div>
                      <div className="w-[150.73px] h-[11.17px] bg-[#F1F1F1] rounded-sm"></div>
                    </div>
                    <div className="w-[46.06px] h-[19.54px] bg-[#F1F1F1] rounded-sm"></div>
                  </div>
                </div>
              </div>
              <span className="text-[#999] text-base font-normal">
                {isOwner
                  ? 'How about creating a project right now?'
                  : 'No projects added yet'}
              </span>
              {isOwner && (
                <>
                  <Button
                    className="bg-[#272727] hover:bg-[#2a2a2a] py-2 px-3 rounded-lg border border-[#535353] ring-[1px] ring-[#272727] gap-x-3"
                    onClick={() => {
                      dispatch(setEditingMode(true));
                      setIsAddingProject(true);
                    }}
                  >
                    <IconWand size={20} className="text-white" />
                    <span className="text-white text-base font-medium">
                      Add Project
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full grid grid-cols-1 sm:grid-cols-2 place-items-center sm:place-items-start md:justify-start justify-center gap-5 transition-all duration-300 pb-6"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <AnimatePresence>
            {isAddingProject && isPageEditing && isOwner && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                ref={addProjectCardRef}
                className="w-full"
              >
                <ProjectCard
                  variant={cardVariant}
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

          <SortableContext
            items={projects ? projects.map((project) => project.id) : []}
            strategy={rectSortingStrategy}
          >
            {projects?.map((project) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                cardVariant={cardVariant}
                isPageEditing={isPageEditing}
                categories={categories}
                projectStatus={projectStatus}
                projectEditChanges={projectEditChanges}
                projectEditIsValid={projectEditIsValid}
                changes={changes}
                projectCardIsEditing={projectCardIsEditing}
                setProjectEditIsValid={setProjectEditIsValid}
                onSubmitProjectChanges={onSubmitProjectChanges}
                setProjectCardIsEditing={setProjectCardIsEditing}
                setProjectEditChanges={
                  setProjectEditChanges as React.Dispatch<
                    React.SetStateAction<{
                      [key: string]:
                        | string
                        | number
                        | boolean
                        | null
                        | undefined;
                    } | null>
                  >
                }
                setProjects={
                  setProjects as React.Dispatch<
                    React.SetStateAction<Project[] | null>
                  >
                }
                setChanges={
                  setChanges as React.Dispatch<
                    React.SetStateAction<{ [key: string]: string }>
                  >
                }
              />
            ))}
          </SortableContext>

          <DragOverlay
            dropAnimation={defaultDropAnimation}
            adjustScale
            style={{ transformOrigin: '0 0 ' }}
            zIndex={100}
            className="z-[100] w-full h-full pointer-events-none"
          >
            {activeId &&
            projects &&
            projects.some((project) => project.id === activeId)
              ? projects
                  .filter((project) => project.id === activeId)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="w-full h-full"
                      ref={setNodeRef}
                      {...attributes}
                      {...listeners}
                    >
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
                          setProjects as React.Dispatch<
                            React.SetStateAction<Project[] | null>
                          >
                        }
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
                  ))
              : null}
          </DragOverlay>

          <AnimatePresence>
            {isCreateProjectPending &&
              !isAddingProject &&
              isPageEditing &&
              isOwner && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={addProjectCardRef}
                  className={cn(
                    'w-full bg-white border border-[#E5E5E5] shadow-project-card rounded-lg flex items-center justify-center',
                    cardVariant === 'horizontal' &&
                      'md:h-[9.125rem] min-h-[9.125rem]',
                    cardVariant === 'big_image' &&
                      'md:h-[10.5rem] min-h-[10.5rem]',
                    cardVariant === 'vertical' &&
                      'md:h-[12.444rem] min-h-[12.444rem]'
                  )}
                >
                  <div className="w-8 h-8 border-2 border-t-[#666666] border-solid rounded-full animate-spin"></div>
                </motion.div>
              )}
          </AnimatePresence>
        </DndContext>
      </motion.div>
    </div>
  );
};

export default Projects;
