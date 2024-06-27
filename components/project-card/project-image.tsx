import { useProjectCardContext } from '@/contexts/project-card-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { UploadButton } from '@/components/uploadthing-button';
import { Project, ProjectStatus as ProjectsStatus } from '@prisma/client';
import ProjectStatus from './project-status';
import { IconPhotoEdit } from '@tabler/icons-react';
import { ClientUploadedFileData } from 'uploadthing/types';
import { toast } from '@/components/ui/use-toast';
import { useState, useTransition } from 'react';
import { updateProjectImage } from '@/actions/project';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectImageProps {
  projectsStatus?: ProjectsStatus[];
  isPageEditing?: boolean;
  projectCardIsEditing?: {
    id: string;
    isEditing: boolean;
  };
  setProjects?: React.Dispatch<React.SetStateAction<Project[] | null>>;
  isAddProjectCard?: boolean;
}

const ProjectImage = ({
  projectsStatus,
  isPageEditing,
  projectCardIsEditing,
  setProjects,
  isAddProjectCard = false,
}: ProjectImageProps) => {
  const { variant, project } = useProjectCardContext();

  const [isPending, setIsPending] = useState<boolean>(false);

  const [isProjectImageUploading, startProjectImageUploading] = useTransition();

  const handleChangeProjectPhoto = async (
    res: ClientUploadedFileData<{
      uploadedBy: string | undefined;
    }>[]
  ) => {
    startProjectImageUploading(() => {
      updateProjectImage(res, project.id).then((data) => {
        if (data.success) {
          toast({
            duration: 3000,
            title: 'Success!',
            description: data?.success,
            variant: 'success',
          });

          setProjects &&
            setProjects((prevProjects) => {
              if (!prevProjects) return prevProjects;

              return prevProjects.map((prevProject) => {
                if (prevProject.id === project.id) {
                  return {
                    ...prevProject,
                    image: data?.project?.image,
                  };
                }

                return prevProject;
              });
            });
        }

        if (data.error) {
          toast({
            duration: 3000,
            title: 'Error',
            description: data?.error,
            variant: 'error',
          });
        }

        setIsPending(false);
      });
    });
  };

  return (
    <div
      className={cn(
        'h-full flex justify-between',
        variant === 'vertical' && 'w-full'
      )}
    >
      <div
        className={cn(
          'relative rounded-sm border-[1.56px] border-white overflow-hidden shadow-project-image',
          variant !== 'big_image' && 'w-[3.5rem] h-[3.5rem]',
          variant === 'big_image' && 'w-[8rem] h-[8rem]'
        )}
      >
        <AnimatePresence>
          {(isPending || isProjectImageUploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-[#E5E5E5] z-50 pointer-events-none cursor-wait"
            >
              <div className="w-4 h-4 border-2 border-t-[#666666] border-solid rounded-full animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>
        {isPageEditing &&
          projectCardIsEditing?.id === project.id &&
          !isAddProjectCard && (
            <div className="w-full h-full flex items-center justify-center bg-[#E5E5E5] relative">
              <UploadButton
                config={{
                  mode: 'auto',
                }}
                endpoint="imageUploader"
                onClientUploadComplete={handleChangeProjectPhoto}
                onUploadProgress={() => {
                  setIsPending(true);
                }}
                onUploadError={() => {
                  toast({
                    duration: 3000,
                    title: 'Error',
                    description: "Couldn't upload the image.",
                    variant: 'error',
                  });
                  setIsPending(false);
                }}
                appearance={{
                  allowedContent: 'hidden',
                  button:
                    isPending || isProjectImageUploading
                      ? 'hidden'
                      : 'w-full h-full ut-uploading:cursor-not-allowed ut-uploading:bg-transparent after:bg-transparent focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-transparent hover:text-accent-foreground rounded-sm bg-transparent border border-[#E5E5E5]',
                  clearBtn: 'hidden',
                  container: 'w-full h-full',
                }}
                content={{
                  button: project?.image ? (
                    <div className="w-full h-full">
                      <Image
                        src={project.image}
                        alt={project.name}
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <IconPhotoEdit
                      size={variant === 'big_image' ? 13 : 20}
                      stroke={1.5}
                      className="text-[#666666]"
                    />
                  ),
                }}
              />
            </div>
          )}
        {((!project.image && projectCardIsEditing?.id !== project.id) ||
          isAddProjectCard) && (
          <div className="w-full h-full flex items-center justify-center bg-[#E5E5E5]">
            <IconPhotoEdit
              size={variant === 'big_image' ? 13 : 20}
              stroke={1.5}
              className="text-[#666666]"
            />
          </div>
        )}
        {project?.image && projectCardIsEditing?.id !== project.id && (
          <div className="w-full h-full">
            <Image
              src={project.image}
              alt={project.name}
              layout="fill"
              className="object-cover"
            />
          </div>
        )}
      </div>
      {variant === 'vertical' && (
        <ProjectStatus projectsStatus={projectsStatus} />
      )}
    </div>
  );
};

export default ProjectImage;
