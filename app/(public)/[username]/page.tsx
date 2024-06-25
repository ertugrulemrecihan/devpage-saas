'use client';

import { checkUser } from '@/actions/profile';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setProfileUser } from '@/lib/features/profile/profileSlice';
import { cn } from '@/lib/utils';

import { ProfileImage } from './_components/profile-image';
import PageEditingBorders from './_components/page-editing-borders';
import LoadingIndicator from '@/components/loading-indicator';
import EditModeBadge from './_components/edit-mode-badge';
import ProfileBanner from './_components/profile-banner';
import UserInformation from './_components/user-information';
import OwnerActions from './_components/owner-actions';
import SocialMediaLinks from './_components/social-media-links';
import ProfileBackgroundDropdown from './_components/profile-background-dropdown';
import Projects from './_components/projects';

const PublicUserPage = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const dispatch = useAppDispatch();

  const { username } = useParams();

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    startTransition(async () => {
      await checkUser(username as string).then((data) => {
        if (data.error) {
          return notFound();
        }

        if (data.success) {
          dispatch(setProfileUser(data.user));
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useLayoutEffect(() => {
    setIsLoading(false);
  }, []);

  if (isPending || isLoading) {
    return <LoadingIndicator />;
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
        <PageEditingBorders />

        <EditModeBadge />
        <div className="w-full h-full bg-white rounded-lg overflow-y-auto">
          <div className="w-full relative">
            <ProfileBanner />

            <div className="w-full pt-[7.5rem]">
              <div className="w-full container relative">
                <ProfileBackgroundDropdown />

                <div className="w-full space-y-6">
                  <div className="w-full flex flex-col lg:flex-row md:items-end items-start md:justify-between">
                    <div className="w-full min-h-[16.5rem] flex flex-col">
                      <ProfileImage />
                      <UserInformation />
                    </div>
                    <div className="w-full h-full flex flex-row-reverse lg:flex-col items-end justify-between min-h-[9.875rem]">
                      <OwnerActions />
                      <SocialMediaLinks />
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-[#E5E5E5]"></div>
                  <Projects />
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
