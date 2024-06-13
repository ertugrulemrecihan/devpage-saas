import { BACKGROUND_STYLE } from '@prisma/client';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateUserPageBackgroundStyle } from '@/actions/profile';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setProfileUser } from '@/lib/features/profile/profileSlice';
import { profileBackgroundColors } from '@/utils/profile-background-colors';

import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState, useTransition } from 'react';

import Down from '@/public/assets/icons/down.svg';

const ProfileBackgroundDropdown = () => {
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector((state) => state.profile.user);
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const currentUser = useCurrentUser();

  const [isAutoSavePending, autoSaveTransition] = useTransition();

  const [currentBackgroundStyle, setCurrentBackgroundStyle] =
    useState<BACKGROUND_STYLE>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);

  useEffect(() => {
    if (profileUser) {
      setCurrentBackgroundStyle(profileUser.userPage?.backgroundStyle);
    }
  }, [profileUser]);

  const handleClick = (key: string) => {
    dispatch(
      setProfileUser({
        ...profileUser!,
        userPage: {
          ...profileUser?.userPage!,
          backgroundStyle: key.toUpperCase() as BACKGROUND_STYLE,
        },
      })
    );

    dispatchAutoSave({
      backgroundStyle: key,
    });
  };

  const updateUserBackground = (backgroundStyle: string) => {
    if (currentUser && isOwner) {
      autoSaveTransition(async () => {
        await updateUserPageBackgroundStyle(backgroundStyle).then(
          (response) => {
            if (response?.success) {
              toast({
                title: 'Success!',
                description: response.success,
                variant: 'success',
                duration: 2000,
              });
            }
          }
        );
      });
    }
  };

  const { dispatchAutoSave } = useAutoSave({
    onSave: updateUserBackground,
  });

  if (isOwner && isPageEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute right-0 py-4"
      >
        <DropdownMenu>
          {Object.entries(profileBackgroundColors).map(
            ([key, value], index) =>
              key.toUpperCase() === profileUser?.userPage?.backgroundStyle && (
                <DropdownMenuTrigger
                  key={index}
                  className="w-full flex items-center justify-center gap-2 ring-0 outline-none border-none focus-within:ring-0 focus-visible:ring-0"
                >
                  <div
                    className="w-6 h-6 ring-2 ring-white rounded-md"
                    style={{
                      background: `linear-gradient(0deg, ${value.borderColors.from}, #F1F1F1)`,
                    }}
                  ></div>
                  <span className="font-medium text-sm text-white capitalize">
                    {key}
                  </span>
                  <Image src={Down} alt="Down" />
                </DropdownMenuTrigger>
              )
          )}
          <DropdownMenuContent>
            {Object.entries(profileBackgroundColors).map(
              ([key, value], index) => (
                <DropdownMenuItem
                  key={index}
                  className="w-full flex items-center gap-2 ring-0 outline-none border-none focus-within:ring-0 focus-visible:ring-0"
                  onClick={() => handleClick(key)}
                >
                  <div
                    className="w-6 h-6 rounded-md"
                    style={{
                      background: `linear-gradient(0deg, ${value.backgroundColor}, #F1F1F1)`,
                    }}
                  ></div>
                  <span className="font-medium text-sm text-black capitalize">
                    {key}
                  </span>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }
};

export default ProfileBackgroundDropdown;
