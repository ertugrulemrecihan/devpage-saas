import { UserForProfile } from '@/types';
import { changeProfilePhoto, deleteProfilePhoto } from '@/actions/settings';
import { useEffect, useState, useTransition } from 'react';
import { ClientUploadedFileData } from 'uploadthing/types';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { useCurrentUser } from '@/hooks/use-current-user';
import { setProfileUser } from '@/lib/features/profile/profileSlice';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/components/uploadthing-button';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

import PhotoEdit from '@/public/assets/icons/photo-edit.svg';
import Trash from '@/public/assets/icons/trash.svg';
import DefaultImage from '@/public/assets/images/default-image.jpg';

export const ProfileImage = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);
  const userProfile = useAppSelector((state) => state.profile.user);
  const dispatch = useAppDispatch();

  const currentUser = useCurrentUser();

  const [user, setUser] = useState<UserForProfile | undefined>(userProfile);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [isProfilePhotoUploading, startProfilePhotoTransition] =
    useTransition();

  useEffect(() => {
    if (currentUser && user) {
      if (currentUser?.id === user?.id) {
        setIsOwner(true);
      }
    }
  }, [currentUser, user?.id]);

  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleChangeProfilePhoto = async (
    res: ClientUploadedFileData<{
      uploadedBy: string | undefined;
    }>[]
  ) => {
    startProfilePhotoTransition(() => {
      changeProfilePhoto(res).then((data) => {
        if (data.success) {
          dispatch(setProfileUser(data?.user));
          toast({
            duration: 3000,
            title: 'Success!',
            description: data?.success,
            variant: 'success',
          });
        }

        if (data.error) {
          toast({
            duration: 3000,
            title: 'Error',
            description: data.error,
            variant: 'error',
          });
        }
      });
    });
  };

  const handleDeleteProfilePhoto = async () => {
    startProfilePhotoTransition(() => {
      deleteProfilePhoto().then((data) => {
        if (data.success) {
          dispatch(setProfileUser(data?.user));
          toast({
            duration: 3000,
            title: 'Success!',
            description: data?.success,
            variant: 'success',
          });
        }

        if (data.error) {
          toast({
            duration: 3000,
            title: 'Error',
            description: data.error,
            variant: 'error',
          });
        }
      });
    });
  };

  return (
    <div className="flex items-center justify-start flex-row">
      <div className="w-[8.563rem] h-[8.563rem] relative">
        <Image
          src={user?.image || DefaultImage}
          alt={user?.name || 'User Image'}
          fill
          className="object-bottom object-cover shadow-profile-image shadow-[#B32FAA12] border-white border-[5px] rounded-[16px]"
        />
      </div>
      <AnimatePresence>
        {isOwner && isPageEditing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="p-2 rounded-r-md bg-white flex flex-col gap-y-2 z-30"
          >
            <UploadButton
              config={{
                mode: 'auto',
              }}
              endpoint="imageUploader"
              onClientUploadComplete={handleChangeProfilePhoto}
              onUploadError={() => {
                toast({
                  duration: 3000,
                  title: 'Error',
                  description: "Couldn't upload the image.",
                  variant: 'error',
                });
              }}
              appearance={{
                allowedContent: 'hidden',
                button:
                  'w-auto h-auto ut-uploading:cursor-not-allowed ut-uploading:bg-[#FDFDFD] after:bg-emerald-400 after:bg-opacity-35 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground p-[7px] rounded-lg bg-[#FDFDFD] border border-[#E5E5E5]',
                clearBtn: 'hidden',
              }}
              content={{
                button: <Image src={PhotoEdit} alt="Edit" />,
              }}
            />

            <Button
              variant="ghost"
              size="icon"
              className="bg-[#FDFDFD] border border-[#E5E5E5]"
              onClick={handleDeleteProfilePhoto}
              disabled={isProfilePhotoUploading}
            >
              <Image src={Trash} alt="Edit" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
