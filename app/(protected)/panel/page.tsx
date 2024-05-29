'use client';

import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { fetchProjects } from '@/actions/project';
import { setUser } from '@/lib/features/user/userSlice';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getUserAllPageDetail } from '@/actions/user-page';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setProjects } from '@/lib/features/projects/projectsSlice';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProfileImage } from '@/app/(protected)/_components/panel/profile-image';
import { UserInfo } from '@/app/(protected)/_components/panel/user-info';
import Image from 'next/image';

import Phone from '@/public/assets/images/phone.png';
import Haze from '@/public/assets/images/backgrounds/haze_profile.svg';
import { BeatLoader } from 'react-spinners';

const PanelPage = () => {
  const user = useAppSelector((state) => state.user);
  const projects = useAppSelector((state) => state.projects);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isPending, startTransition] = useTransition();

  const sessionUser = useCurrentUser();

  useEffect(() => {
    if (sessionUser) {
      if (user && user.id === sessionUser.id) return;
      startTransition(() => {
        getUserAllPageDetail(sessionUser.id as string).then((data) => {
          dispatch(setUser(data.user));
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (projects && projects.length > 0) return;
    startTransition(() => {
      fetchProjects().then((data) => {
        if (data.success) {
          dispatch(setProjects(data.projects));
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="w-full h-full grid grid-cols-2">
      <Card className="w-full h-full rounded-[0.75rem] shadow-none border-none bg-[#FAFAFA] relative overflow-auto">
        <CardHeader className="p-0 space-y-0 select-none">
          <div className="w-full h-[11.313rem] relative">
            <Image
              src={Haze}
              alt="Haze"
              fill
              className="object-bottom object-cover rounded-t-[0.75rem]"
            />
          </div>
        </CardHeader>
        <CardContent className="w-full absolute top-[6.625rem]">
          <div className="px-14 space-y-6">
            <ProfileImage />
            <UserInfo />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center">
        <Image src={Phone} alt="Phone" />
      </div>
    </div>
  );
};

export default PanelPage;
