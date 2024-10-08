import { cn } from '@/lib/utils';
import ProjectCardContext from '@/contexts/project-card-context';
import {
  Category,
  Project,
  ProjectStatus as ProjectsStatus,
} from '@prisma/client';

import ProjectImage from './project-image';
import ProjectDetails from './project-details';
import ProjectStatus from './project-status';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  IconCoin,
  IconInfoCircle,
  IconLink,
  IconPencilMinus,
} from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { deleteProject } from '@/actions/project';
import { toast } from '../ui/use-toast';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface ProjectCardProps {
  project?: Project;
  variant?: 'horizontal' | 'big_image' | 'vertical';
  isPageEditing?: boolean;
  children: React.ReactNode;
  categories?: Category[];
  projectsStatus?: ProjectsStatus[];
  isValid: boolean;
  changes?: { [key: string]: string };
  isAddProjectCard?: boolean;
  onChange: (key: string, value: any) => void;
  onClose?: () => void;
  onSubmit?: () => void;
  setProjectCardIsEditing?: React.Dispatch<
    React.SetStateAction<{ id: string; isEditing: boolean }>
  >;
  setProjects?: React.Dispatch<React.SetStateAction<Project[] | null>>;
  setProjectCardHovered?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IsInputEditOpenProps {
  category: boolean;
  projectStatus: boolean;
}

interface ValueProps {
  [key: string]: string;
}

const ProjectCard = ({
  variant = 'horizontal',
  isPageEditing = false,
  project,
  children,
  categories,
  projectsStatus,
  isValid,
  changes,
  isAddProjectCard,
  onChange,
  onClose,
  onSubmit,
  setProjectCardIsEditing,
  setProjects,
  setProjectCardHovered,
}: ProjectCardProps) => {
  const projectCardRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isHaveChanges, setIsHaveChanges] = useState<boolean>(false);
  const [onSubmitChanges, setOnSubmitChanges] = useState<boolean>(isValid);
  const [value, setValue] = useState<ValueProps | null>(null);
  const [isInputEditOpen, setIsInputEditOpen] = useState<IsInputEditOpenProps>({
    category: false,
    projectStatus: false,
  });
  const [currentProject, setCurrentProject] = useState<Project>(
    project ||
      ({
        id: '',
        name: '',
        description: '',
        revenue: 0,
        image: '',
        categoryId: '',
        statusId: '',
        url: '',
        index: 0,
      } as Project)
  );

  const [isDeleteProjectPending, startDeleteProjectTransition] =
    useTransition();

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          projectCardRef.current &&
          !projectCardRef.current.contains(e.target as Node)
        ) {
          if (isHaveChanges) {
            setIsDialogOpen(true);
          } else {
            setIsDialogOpen(false);
            setIsEditing(false);
            setProjectCardIsEditing &&
              setProjectCardIsEditing({
                id: '',
                isEditing: false,
              });
            setIsHaveChanges(false);
            setOnSubmitChanges(false);
            setIsInputEditOpen({
              category: false,
              projectStatus: false,
            });
            setValue(null);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, isHaveChanges]);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project]);

  useEffect(() => {
    if (changes) {
      setIsHaveChanges(true);
    }
  }, [changes]);

  const handleChange = (key: string, value: string) => {
    setIsHaveChanges(true);
    setValue((prevValue) => ({
      ...(prevValue || {}),
      [key]: value,
    }));
    onChange && onChange(key, value);
  };

  const handleDiscardChanges = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setProjectCardIsEditing &&
      setProjectCardIsEditing({
        id: '',
        isEditing: false,
      });
    setIsHaveChanges(false);
    setOnSubmitChanges(false);
    setIsInputEditOpen({
      category: false,
      projectStatus: false,
    });
    setValue(null);
    onClose && onClose();
  };

  useEffect(() => {
    if (isValid && onSubmitChanges) {
      setIsDialogOpen(false);
      setIsEditing(false);
      setProjectCardIsEditing &&
        setProjectCardIsEditing({
          id: '',
          isEditing: false,
        });
      setIsHaveChanges(false);
      setOnSubmitChanges(false);
      setIsInputEditOpen({
        category: false,
        projectStatus: false,
      });
      setValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSubmitChanges, isValid]);

  const handleOnSubmit = () => {
    onSubmit && onSubmit();
    setOnSubmitChanges(true);
  };

  const handleDeleteProject = () => {
    startDeleteProjectTransition(async () => {
      setIsDialogOpen(false);
      setIsEditing(false);
      setProjectCardIsEditing &&
        setProjectCardIsEditing({
          id: '',
          isEditing: false,
        });
      setIsHaveChanges(false);
      setOnSubmitChanges(false);
      setIsInputEditOpen({
        category: false,
        projectStatus: false,
      });
      setValue(null);
      deleteProject(currentProject.id).then((data) => {
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

          setProjects &&
            setProjects((prevProjects) => {
              if (prevProjects) {
                return prevProjects.filter(
                  (project) => project.id !== currentProject.id
                );
              }
              return prevProjects;
            });
        }
      });
    });
  };

  return (
    <ProjectCardContext.Provider
      value={{
        project: currentProject,
        variant,
        isPageEditing,
      }}
    >
      <Dialog open={isDialogOpen}>
        <DialogContent hideCloseButton className="w-full flex flex-col gap-y-5">
          <div className="w-full flex flex-col gap-y-6">
            <div className="w-full flex justify-center">
              <IconInfoCircle
                stroke={1.5}
                className="w-14 h-14 text-[#FEE2E2] fill-[#EF4444]"
              />
            </div>
            <div className="w-full flex flex-col items-center gap-y-3">
              <span className="text-xl font-medium">
                Are you sure you want to take this action?
              </span>
              <span className="text-[#6C737F] text-base">
                The transaction will not be reversible.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-x-3">
            <Button
              className="w-full px-4 py-[10px] h-11 rounded-lg"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              <span>Cancel</span>
            </Button>
            <Button
              className="w-full px-4 py-[10px] h-11 rounded-lg bg-[#EF4444] text-white border border-[#F87171] ring-[1px] ring-[#B91C1C] hover:bg-[#DC2626] hover:text-white"
              variant="outline"
              onClick={handleDiscardChanges}
            >
              <span>Discard Changes</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div
        ref={projectCardRef}
        className={cn(
          'max-w-[30.563rem] w-full h-full relative transition-all duration-300',
          ((isEditing && isPageEditing) || isAddProjectCard) &&
            'p-1 bg-[#FAFAFA] rounded-t-[10px]'
        )}
        onClick={() => {
          if (!isEditing && !isPageEditing) {
            if (project?.url) {
              window.open(project?.url, '_blank');
            }
          }
        }}
      >
        {isDeleteProjectPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white border border-[#E5E5E5] shadow-project-card z-50 pointer-events-none cursor-wait rounded-lg"
          >
            <div className="w-7 h-7 border-2 border-t-[#666666] border-solid rounded-full animate-spin"></div>
          </motion.div>
        )}
        <div
          className={cn(
            'max-w-[30.563rem] group w-full flex items-center p-5 rounded-lg bg-white border border-[#E5E5E5] shadow-project-card relative overflow-hidden transition-all duration-300',
            variant === 'horizontal' &&
              'gap-x-5 items-start h-full min-h-[9.125rem]',
            variant === 'big_image' && 'gap-x-5 h-full min-h-[10.5rem]',
            variant === 'vertical' &&
              'flex-col h-full gap-y-5 min-h-[12.444rem]',
            isPageEditing && isEditing && 'cursor-pointer',
            project?.url && !isPageEditing && 'cursor-pointer'
          )}
          onMouseEnter={() => !isEditing && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
          {variant !== 'vertical' && (
            <ProjectStatus projectsStatus={projectsStatus} />
          )}
          <AnimatePresence>
            {isHovered && isPageEditing && !isAddProjectCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 z-20 flex items-end w-full h-full bg-gradient-to-t from-20% from-[#FFFFFF] to-[#FFFFFF00]"
              >
                <div className="p-3 w-full flex items-center gap-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-x-2 w-full rounded-lg"
                    onClick={() => {
                      setIsEditing(true);
                      setProjectCardIsEditing &&
                        setProjectCardIsEditing({
                          id: project?.id || '',
                          isEditing: true,
                        });
                      setIsHovered(false);
                    }}
                  >
                    <IconPencilMinus
                      size={20}
                      stroke={1.5}
                      className="text-[#333]"
                    />
                    <span className="text-base text-[#333]">Edit Card</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-x-2 rounded-lg"
                    onClick={handleDeleteProject}
                  >
                    <span className="text-base text-[#DC2626]">Delete</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {((isEditing && isPageEditing) || isAddProjectCard) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: isAddProjectCard ? 0.3 : 0 }}
              className={cn(
                'absolute top-full z-40 left-0 w-full flex flex-col rounded-b-[10px] bg-[#FAFAFA] px-2 pb-2 gap-y-3 shadow-project-edit-mode',
                {
                  'pt-2': isAddProjectCard,
                }
              )}
            >
              <div className="w-full flex items-center gap-x-2 relative">
                <select
                  className="w-full h-9 outline-none ring-[1px] ring-input rounded-md px-3 py-2 border-r-[12px] border-white cursor-pointer"
                  onChange={(e) => handleChange('category', e.target.value)}
                  value={value?.category || project?.categoryId || ''}
                >
                  <option value="" selected disabled hidden>
                    Category
                  </option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full h-9 outline-none ring-[1px] ring-input rounded-md px-3 py-2 border-r-[12px] border-white cursor-pointer"
                  onChange={(e) =>
                    handleChange('project_status', e.target.value)
                  }
                  value={value?.project_status || project?.statusId || ''}
                >
                  <option value="" selected disabled hidden>
                    Project Status
                  </option>
                  {projectsStatus?.map((projectStatus) => (
                    <option key={projectStatus.id} value={projectStatus.id}>
                      {projectStatus.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  className={cn('w-10 h-10 p-[10px]', {
                    'shadow-project-card-button': isInputEditOpen.category,
                  })}
                  onClick={() =>
                    setIsInputEditOpen({
                      category: !isInputEditOpen.category,
                      projectStatus: false,
                    })
                  }
                >
                  <IconLink size={20} stroke={1.5} className="text-[#333]" />
                </Button>
                <Button
                  variant="outline"
                  className={cn('w-10 h-10 p-[10px]', {
                    'shadow-project-card-button': isInputEditOpen.projectStatus,
                  })}
                  onClick={() =>
                    setIsInputEditOpen({
                      category: false,
                      projectStatus: !isInputEditOpen.projectStatus,
                    })
                  }
                >
                  <IconCoin size={20} stroke={1.5} className="text-[#333]" />
                </Button>
              </div>
              <div>
                <AnimatePresence>
                  {isInputEditOpen.category && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm font-medium text-black"
                        >
                          URL
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex w-full items-center rounded-md border border-input bg-transparent shadow-sm px-3"
                        >
                          <IconLink
                            size={20}
                            stroke={1.5}
                            className="text-[#666666]"
                          />
                          <Input
                            className="w-full border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent shadow-none"
                            placeholder="Write your url"
                            onChange={(e) =>
                              handleChange('url', e.target.value)
                            }
                            defaultValue={value?.url || project?.url || ''}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isInputEditOpen.projectStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-medium text-black"
                      >
                        Revenue
                      </motion.span>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex w-full items-center rounded-md border border-input bg-transparent shadow-sm px-3"
                      >
                        <IconCoin
                          size={20}
                          stroke={1.5}
                          className="text-[#666666]"
                        />
                        <Input
                          className="w-full border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent shadow-none"
                          placeholder="Write your Revenue"
                          onChange={(e) =>
                            handleChange('revenue', e.target.value)
                          }
                          defaultValue={
                            value?.revenue || project?.revenue || ''
                          }
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {isHaveChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleOnSubmit}
                      className="bg-[#272727] w-full h-10 hover:bg-[#303030] border border-[#535353] ring-[1px] ring-[#272727]"
                    >
                      <span className="text-base font-medium text-white">
                        {isAddProjectCard ? 'Add Project' : 'Save Changes'}
                      </span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProjectCardContext.Provider>
  );
};

ProjectCard.Image = ProjectImage;
ProjectCard.Details = ProjectDetails;

export default ProjectCard;
