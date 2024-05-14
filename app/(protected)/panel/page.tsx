'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useTransition } from 'react';
import { getUserAllPageDetail } from '@/actions/user-page';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UsernameForm } from '@/app/(protected)/_components/panel/username-form';
import { UserPageDetails } from '@/app/(protected)/_components/panel/user-page-details';
import { AddProjectForm } from '@/app/(protected)/_components/panel/add-project-form';
import { ProjectList } from '@/app/(protected)/_components/panel/project-list';
import { BeatLoader } from 'react-spinners';
import { fetchProjects } from '@/actions/project';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setProjects } from '@/lib/features/projects/projectsSlice';
import { setUser } from '@/lib/features/user/userSlice';

const PanelPage = () => {
  const user = useAppSelector((state) => state.user);
  const projects = useAppSelector((state) => state.projects);
  const dispatch = useAppDispatch();

  const [isPending, startTransition] = useTransition();

  const sessionUser = useCurrentUser();

  useEffect(() => {
    if (sessionUser && !user) {
      startTransition(() => {
        getUserAllPageDetail(sessionUser.id as string)
          .then((data) => {
            dispatch(setUser(data.user));
          })
          .catch((error) => {
            console.error(error);
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

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">📊 Panel</p>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="w-full flex justify-center">
            <BeatLoader color="#2563EB" />
          </div>
        ) : (
          <div className="space-y-2">
            <UsernameForm />
            <UserPageDetails />
            <div className="w-full h-[2px] bg-secondary" />
            <div className="w-full p-4 bg-secondary rounded-md space-y-4">
              <AddProjectForm />
              <div className="w-full h-[2px] bg-white" />
              <ProjectList />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanelPage;
