import { fetchProjects, updateProject } from '@/actions/project';
import { ProjectCard } from '@/components/project-card';
import ProjectCardSkeleton from '@/components/project-card/project-card-skeleton';
import { Category, Project, ProjectStatus } from '@prisma/client';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import RefreshIcon from '@/public/assets/icons/refresh';
import { IconPlus } from '@tabler/icons-react';
import { useAppSelector } from '@/lib/rtk-hooks';
import { fetchCategories } from '@/actions/category';
import { fetchProjectStatus } from '@/actions/project-status';
import { ProjectEditChangesProps } from '@/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ProjectEditSchema } from '@/schemas';
import { toast } from '@/components/ui/use-toast';

const Projects = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);
  const profileUser = useAppSelector((state) => state.profile.user);

  const currentUser = useCurrentUser();

  const params = useParams();
  const username = params.username;

  const [projects, setProjects] = useState<Project[] | null>();
  const [categories, setCategories] = useState<Category[] | undefined>();
  const [projectEditIsValid, setProjectEditIsValid] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [projectEditChanges, setProjectEditChanges] =
    useState<ProjectEditChangesProps | null>();
  const [projectStatus, setProjectStatus] = useState<
    ProjectStatus[] | undefined
  >();

  const [isPending, startFetchProjectsTransition] = useTransition();
  const [isProjectUpdatePending, startUpdateProjectTransition] =
    useTransition();

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);

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

            let revenue = undefined;

            if (validatedValues.data.revenue) {
              revenue = parseFloat(validatedValues.data.revenue as string);
            }

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
        className="w-full h-full flex justify-start gap-5 flex-wrap"
      >
        <AnimatePresence>
          {isAddingProject && isPageEditing && isOwner && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: [20, 0, 15, 0, 5, 0] }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                }}
              >
                haburası proje kartı için ayrılmış bir alan
              </motion.div>
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
          >
            <ProjectCard.Image projectsStatus={projectStatus} />
            <ProjectCard.Details categories={categories} />
          </ProjectCard>
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;
