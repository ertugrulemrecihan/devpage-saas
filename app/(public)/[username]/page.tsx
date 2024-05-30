'use client';

import * as z from 'zod';
import { ProfileBackgroundColorsType, UserForProfile } from '@/types';
import { checkUser } from '@/actions/profile';
import { useAutoSave } from '@/hooks/use-auto-save';
import { notFound, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { UserPageDetailsSchema } from '@/schemas';
import { updateUserPageDetails } from '@/actions/user-page';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setEditingMode } from '@/lib/features/profile/profileSlice';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import { BeatLoader } from 'react-spinners';
import { toast } from '@/components/ui/use-toast';
import { ProfileBackground } from '@/components/profile-background';
import { profileBackgroundColors } from '@/utils/profile-background-colors';
import { InlineEdit } from '@/components/inline-edit';
import { motion, AnimatePresence } from 'framer-motion';

import Location from '@/public/assets/icons/location.svg';
import DefaultImage from '@/public/assets/images/default-image.jpg';
import { Button } from '@/components/ui/button';
import { SocialMediaButton } from '@/components/social-media-button';

import Settings from '@/public/assets/icons/settings';
import Phone from '@/public/assets/icons/phone.svg';

type ProfileBackgroundProps = {
  backgroundColor: string;
  borderColors: {
    from: string;
    to: string;
  };
};

const PublicUserPage = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const dispatch = useAppDispatch();

  const { username } = useParams();

  const currentUser = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const [isAutoSavePending, autoSaveTransition] = useTransition();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageUser, setPageUser] = useState<UserForProfile | undefined>();
  const [profileBackground, setProfileBackground] =
    useState<ProfileBackgroundProps | null>();

  const isOwner = currentUser?.id === pageUser?.id;

  useEffect(() => {
    startTransition(async () => {
      await checkUser(username as string).then((data) => {
        if (data.error) {
          return notFound();
        }

        if (data.success) {
          const backgroundStyle = data.user.userPage?.backgroundStyle
            .toLocaleLowerCase()
            .toString();

          setPageUser(data.user);
          setProfileBackground({
            backgroundColor:
              profileBackgroundColors[
                backgroundStyle as keyof ProfileBackgroundColorsType
              ].backgroundColor,
            borderColors: {
              from: profileBackgroundColors[
                backgroundStyle as keyof ProfileBackgroundColorsType
              ].borderColors.from,
              to: profileBackgroundColors[
                backgroundStyle as keyof ProfileBackgroundColorsType
              ].borderColors.to,
            },
          });
        }
      });
    });
  }, [username]);

  const updateUserDetails = (data: z.infer<typeof UserPageDetailsSchema>) => {
    if (currentUser && isOwner) {
      autoSaveTransition(async () => {
        await updateUserPageDetails(pageUser?.id as string, data)
          .then((response) => {
            if (response?.success) {
              setPageUser((prev: any) => {
                if (Object.keys(data).includes('name')) {
                  return {
                    ...prev,
                    name: data.name,
                  };
                }
                return {
                  ...prev,
                  userPage: {
                    ...prev?.userPage,
                    ...data,
                  },
                };
              });

              toast({
                title: 'Success!',
                description: 'Details updated successfully!',
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

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    const validatedValue = UserPageDetailsSchema.safeParse({
      [key]: value,
    });

    if (!validatedValue.success) {
      toast({
        title: 'Error!',
        description: validatedValue.error.issues[0].message,
        variant: 'error',
        duration: 2000,
      });
      return;
    }

    dispatchAutoSave({
      [key]: validatedValue.data[key as keyof typeof validatedValue.data],
    });
  };

  useLayoutEffect(() => {
    setIsLoading(false);
  }, []);

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <BeatLoader color="#3B82F6" />
      </div>
    );
  }

  return (
    <main
      className={cn(
        'w-full h-full min-h-screen transition-all duration-300 overflow-x-hidden',
        {
          'p-4 flex items-center justify-center': isPageEditing,
        }
      )}
    >
      <div
        className={cn('w-full h-full relative overflow-hidden', {
          'rounded-xl shadow-edit-mode p-1': isPageEditing,
        })}
      >
        {isPageEditing && (
          <>
            <div className="edit-mode-line top-right z-[-1]"></div>
            <div className="edit-mode-line top-left z-[-1]"></div>
            <div className="edit-mode-line right-line z-[-1]"></div>
            <div className="edit-mode-line left-line z-[-1]"></div>
            <div className="edit-mode-line bottom-right z-[-1]"></div>
            <div className="edit-mode-line bottom-left z-[-1]"></div>
          </>
        )}

        <div className="w-full h-full bg-[#FAFAFA] rounded-lg">
          <div className="w-full relative">
            <AnimatePresence>
              {isPageEditing && (
                <motion.div
                  initial={{ top: -20, opacity: 0 }}
                  animate={{ top: [-20, -20, 40, 40, 0], opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-0 z-50 w-full flex justify-center"
                >
                  <div className="bg-[#A855F7] rounded-b-lg flex items-center justify-center px-4 py-[3px]">
                    <span className="text-xs text-white font-medium">
                      Edit Mode
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isPageEditing && (
                <motion.div
                  initial={{ right: -20, opacity: 0 }}
                  animate={{ right: 0, opacity: 1 }}
                  exit={{ right: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 z-50 w-full flex justify-end px-4 py-3"
                >
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" className="gap-2">
                      <Image src={Phone} alt="Phone" />
                      <span>Device Preview</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        dispatch(setEditingMode(false));
                      }}
                      className="text-[#B91C1C]"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {profileBackground && (
              <div className="absolute top-0 left-0 w-full z-0">
                <ProfileBackground
                  backgroundColor={profileBackground.backgroundColor}
                  borderColors={profileBackground.borderColors}
                />
              </div>
            )}
            <div className="w-full *:pt-[7.5rem]">
              <div className="w-full container">
                <div className="w-full flex items-end justify-between">
                  <div className="flex flex-col w-full">
                    <div className="w-[8.563rem] h-[8.563rem] relative">
                      <Image
                        src={pageUser?.image || DefaultImage}
                        alt={pageUser?.name || 'User Image'}
                        fill
                        className="object-bottom object-cover shadow-profile-image shadow-[#B32FAA12] border-white border-[5px] rounded-[16px]"
                      />
                    </div>
                    <div className="mt-[19px] flex flex-col items-start gap-3">
                      {(pageUser?.userPage?.location || isOwner) && (
                        <div className="flex items-center gap-[6px] h-6">
                          <Image src={Location} alt="Location" />
                          {isOwner && isPageEditing ? (
                            <InlineEdit
                              viewText={
                                pageUser?.userPage?.location || 'Add Location'
                              }
                              value={pageUser?.userPage?.location || undefined}
                              onChange={(e) => handleChange('location', e)}
                              placeholder="Add Location"
                            />
                          ) : (
                            <span className="text-base text-[#808080]">
                              {pageUser?.userPage?.location}
                            </span>
                          )}
                        </div>
                      )}
                      {(pageUser?.name || isOwner) && (
                        <div className="flex items-center gap-3 h-8">
                          {isOwner && isPageEditing ? (
                            <InlineEdit
                              viewText={pageUser?.name || 'Add Name'}
                              value={pageUser?.name || undefined}
                              onChange={(e) => handleChange('name', e)}
                              viewElement={
                                <span className="text-2xl font-medium text-[#1A1A1A]">
                                  {pageUser?.name}
                                </span>
                              }
                              inputStyle="w-full text-2xl font-medium text-[#1A1A1A] items-center"
                              placeholder="Add Name"
                            />
                          ) : (
                            <span className="text-2xl font-medium text-[#1A1A1A]">
                              {pageUser?.name}
                            </span>
                          )}
                          {pageUser?.userPage?.contactEmail ||
                            (isOwner && isPageEditing && (
                              <SocialMediaButton
                                type="email"
                                isOpenable={isOwner && isPageEditing}
                                url="#"
                              />
                            ))}
                        </div>
                      )}
                      {(pageUser?.userPage?.biography || isOwner) && (
                        <div className="flex items-center gap-[6px] h-6">
                          {isOwner && isPageEditing ? (
                            <InlineEdit
                              viewText={
                                pageUser?.userPage?.biography || 'Add Biography'
                              }
                              value={pageUser?.userPage?.biography || undefined}
                              onChange={(e) => handleChange('biography', e)}
                              placeholder="Add Biography"
                            />
                          ) : (
                            <span className="text-base text-[#808080]">
                              {pageUser?.userPage?.biography}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-full min-h-[156px] flex flex-col items-end justify-between">
                    {isOwner && !isPageEditing ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (isOwner) {
                              dispatch(setEditingMode(true));
                            }
                          }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="w-9 h-9"
                          size="icon"
                        >
                          <Settings stroke="#333" />
                        </Button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <div className="flex items-start gap-x-2">
                      <SocialMediaButton
                        type="github"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                      <SocialMediaButton
                        type="x"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                      <SocialMediaButton
                        type="youtube"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                      <SocialMediaButton
                        type="instagram"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                      <SocialMediaButton
                        type="dribbble"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                      <SocialMediaButton
                        type="linkedin"
                        url="#"
                        isOpenable={isOwner && isPageEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicUserPage;
