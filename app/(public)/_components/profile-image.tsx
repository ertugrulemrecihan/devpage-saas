import { UserWithUserPage } from '@/types';
import { changeProfilePhoto, deleteProfilePhoto } from '@/actions/settings';
import { useEffect, useState, useTransition } from 'react';
import { ClientUploadedFileData } from 'uploadthing/types';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setUser as rtkSetUser } from '@/lib/features/user/userSlice';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/components/uploadthing-button';
import { toast } from '@/components/ui/use-toast';

import PhotoEdit from '@/public/assets/icons/photo-edit.svg';
import Trash from '@/public/assets/icons/trash.svg';
import DefaultImage from '@/public/assets/images/default-image.jpg';

import '@uploadthing/react/styles.css';

export const ProfileImage = () => {
  const rtkUser = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [user, setUser] = useState<UserWithUserPage | undefined>(rtkUser);

  const [isProfilePhotoUploading, startProfilePhotoTransition] =
    useTransition();

  useEffect(() => {
    setUser(rtkUser);
  }, [rtkUser]);

  const handleChangeProfilePhoto = async (
    res: ClientUploadedFileData<{
      uploadedBy: string | undefined;
    }>[]
  ) => {
    startProfilePhotoTransition(() => {
      changeProfilePhoto(res).then((data) => {
        if (data.success) {
          dispatch(rtkSetUser(data?.user));
          toast({
            duration: 3000,
            title: 'Success!',
            description: data?.success,
          });
        }

        if (data.error) {
          toast({
            duration: 3000,
            title: 'Error',
            description: data.error,
          });
        }
      });
    });
  };

  const handleDeleteProfilePhoto = async () => {
    startProfilePhotoTransition(() => {
      deleteProfilePhoto().then((data) => {
        if (data.success) {
          dispatch(rtkSetUser(data?.user));
          toast({
            duration: 3000,
            title: 'Success!',
            description: data?.success,
          });
        }

        if (data.error) {
          toast({
            duration: 3000,
            title: 'Error',
            description: data.error,
          });
        }
      });
    });
  };

  return (
    <div className="flex items-center justify-start flex-row">
      <div className="w-[8.25rem] h-[8.25rem] relative">
        <Image
          src={user?.image || DefaultImage}
          alt="User Profile"
          fill
          className="object-cover rounded-[1.25rem] border-[5px] border-white"
        />
      </div>
      <div className="p-2 rounded-r-md bg-white flex flex-col gap-y-2">
        <UploadButton
          config={{
            mode: 'auto',
          }}
          endpoint="imageUploader"
          onClientUploadComplete={handleChangeProfilePhoto}
          onUploadError={(error: Error) => {
            toast({
              duration: 3000,
              title: 'Error',
              content: "Couldn't upload the image.",
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
      </div>
    </div>
  );
};
