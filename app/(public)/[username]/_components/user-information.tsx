import * as z from 'zod';
import { UserPageDetailsSchema } from '@/schemas';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateUserPageDetails } from '@/actions/profile';
import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setProfileUser } from '@/lib/features/profile/profileSlice';

import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialMediaButton } from '@/components/social-media-button';

import { InlineEdit } from '@/components/inline-edit';
import Location from '@/public/assets/icons/location.svg';

const UserInformation = () => {
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector((state) => state.profile.user);
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const currentUser = useCurrentUser();

  const [isAutoSavePending, autoSaveTransition] = useTransition();

  const [errorTimer, setErrorTimer] = useState<number | NodeJS.Timeout>(500);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    const validatedValue = UserPageDetailsSchema.safeParse({
      [key]: value,
    });

    if (validatedValue.success) {
      if (key === 'name') {
        dispatch(
          setProfileUser({
            ...profileUser!,
            name: value,
          })
        );
      } else {
        dispatch(
          setProfileUser({
            ...profileUser!,
            userPage: {
              ...profileUser?.userPage!,
              [key]: value,
            },
          })
        );
      }

      dispatchAutoSave({
        [key]: validatedValue.data[key as keyof typeof validatedValue.data],
      });
    }

    clearTimeout(errorTimer);

    const timer = setTimeout(() => {
      if (validatedValue.error)
        return toast({
          title: 'Error!',
          description: validatedValue.error.issues[0].message,
          variant: 'error',
          duration: 2000,
        });
    }, 500);

    setErrorTimer(timer);
  };

  const updateUserDetails = (data: z.infer<typeof UserPageDetailsSchema>) => {
    if (currentUser && isOwner) {
      autoSaveTransition(async () => {
        await updateUserPageDetails(profileUser?.id as string, data)
          .then((response) => {
            if (response?.success) {
              if (Object.keys(data).includes('name')) {
                dispatch(
                  setProfileUser({
                    ...profileUser!,
                    name: data.name as string,
                  })
                );
              }

              dispatch(
                setProfileUser({
                  ...profileUser!,
                  userPage: {
                    ...profileUser?.userPage!,
                    ...data,
                  },
                })
              );

              toast({
                title: 'Success!',
                description: response.success,
                variant: 'success',
                duration: 1000,
              });
            }
          })
          .catch(() => {
            toast({
              title: 'Error!',
              description: 'Something went wrong!',
              variant: 'error',
              duration: 2000,
            });
          });
      });
    }
  };

  const { dispatchAutoSave } = useAutoSave({
    onSave: updateUserDetails,
  });

  return (
    <div className="mt-[19px] flex flex-col items-start space-y-3">
      {(profileUser?.userPage?.location || isPageEditing) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-[6px] h-6"
        >
          <Image src={Location} alt="Location" />
          {isOwner && isPageEditing ? (
            <InlineEdit
              viewText={profileUser?.userPage?.location || 'Add Location'}
              value={profileUser?.userPage?.location || undefined}
              onChange={(e) => handleChange('location', e)}
              placeholder="Add Location"
              maxLength={50}
            />
          ) : (
            <span className="text-base whitespace-nowrap text-[#808080]">
              {profileUser?.userPage?.location}
            </span>
          )}
        </motion.div>
      )}
      {(profileUser?.name || isPageEditing) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[834px] flex flex-col md:flex-row items-start md:items-center md:space-x-3 relative"
        >
          {isOwner && isPageEditing ? (
            <InlineEdit
              viewText={profileUser?.name || 'Add Name'}
              defaultValue={profileUser?.name || ''}
              onChange={(e) => handleChange('name', e)}
              viewElement={
                <span className="text-2xl whitespace-nowrap font-medium text-[#1A1A1A]">
                  {profileUser?.name}
                </span>
              }
              inputStyle="max-w-[700px] text-2xl font-medium text-[#1A1A1A]"
              placeholder="Add Name"
              maxLength={50}
            />
          ) : (
            <span className="text-2xl whitespace-nowrap font-medium text-[#1A1A1A]">
              {profileUser?.name}
            </span>
          )}
          <AnimatePresence>
            {(profileUser?.userPage?.contactEmail || isPageEditing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SocialMediaButton
                  type="email"
                  isOpenable={isOwner && isPageEditing}
                  url={`mailto:${profileUser?.userPage?.contactEmail}`}
                  placeholder="Add Contact Email"
                  defaultValue={
                    profileUser?.userPage?.contactEmail || undefined
                  }
                  onChange={(e) => {
                    handleChange('contactEmail', e);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {(profileUser?.userPage?.biography || isPageEditing) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[300px] flex items-center gap-[6px]"
        >
          {isOwner && isPageEditing ? (
            <InlineEdit
              viewText={profileUser?.userPage?.biography || 'Add Biography'}
              value={profileUser?.userPage?.biography || undefined}
              onChange={(e) => handleChange('biography', e)}
              placeholder="Add Biography"
              maxLength={200}
            />
          ) : (
            <span className="text-base text-[#808080]">
              {profileUser?.userPage?.biography}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UserInformation;
