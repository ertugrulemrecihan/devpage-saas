import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { useEffect, useState } from 'react';
import { UserWithUserPage } from '@/types';

import { SocialMediaButton } from '@/components/social-media-button';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import Mail from '@/public/assets/icons/mail.svg';
import Location from '@/public/assets/icons/location.svg';
import Refresh from '@/public/assets/icons/refresh.svg';
import Plus from '@/public/assets/icons/plus.svg';
import DefaultImage from '@/public/assets/images/default-image.jpg';
import EyeEdit from '@/public/assets/icons/eye-edit.svg';
import Magic from '@/public/assets/icons/magic.svg';

export const UserInfo = () => {
  const rtkProjects = useAppSelector((state) => state.projects);
  const rtkUser = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [user, setUser] = useState<UserWithUserPage | undefined>(rtkUser);
  const [projects, setProjects] = useState(rtkProjects);

  useEffect(() => {
    setProjects(rtkProjects);
  }, [rtkProjects]);

  useEffect(() => {
    setUser(rtkUser);
  }, [rtkUser]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <div className="w-full h-6 flex items-center gap-[.325rem]">
          <Image src={Location} alt="Location" />
          <span className="text-[#808080] text-base font-normal">
            {user?.userPage?.location}
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="w-full h-8 flex flex-col">
            <div className="flex items-center gap-x-3">
              <h1 className="text-2xl text-[#1A1A1A] font-medium">
                {user?.name}
              </h1>
              <Button
                variant="outline"
                className="rounded-lg gap-x-2 border-[#E5E5E5]"
              >
                <span className="text-sm font-medium text-[#333]">
                  Add Mail
                </span>
                <Image src={Mail} alt="Location" />
              </Button>
            </div>
          </div>
          <span className="text-[#94A3B8] text-base font-normal">
            @{user?.username}
          </span>
        </div>
        <div className="flex flex-row items-center gap-x-1">
          <div className="flex items-start gap-x-2">
            <SocialMediaButton type="github" url="#" />
            <SocialMediaButton type="x" url="#" />
            <SocialMediaButton type="youtube" url="#" />
            <SocialMediaButton type="instagram" url="#" />
            <SocialMediaButton type="dribbble" url="#" />
            <SocialMediaButton type="linkedin" url="#" />
          </div>
          <div>
            <Button variant="ghost" className="px-3 py-[0.375rem] gap-x-2">
              <span className="text-sm text-[#666] font-medium">Style</span>
              <Image src={Refresh} alt="Refresh" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col px-4 py-3 bg-white rounded-[12px] gap-y-1">
          <span className="text-xs text-[#94A3B8] font-semibold">BIO</span>
          <Textarea
            className="w-full h-5 focus-within:ring-0 focus-visible:ring-0 border-none shadow-none resize-none p-0 text-base font-normal text-[#384250]"
            defaultValue={user?.userPage?.biography || ''}
            placeholder="Please Enter Your BIO"
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#E5E5E5]" />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="px-3 py-[0.375rem] gap-x-2">
            <span className="text-sm text-[#666] font-medium">Add Project</span>
            <Image src={Plus} alt="Plus" />
          </Button>
          <Button variant="ghost" className="px-3 py-[0.375rem] gap-x-2">
            <span className="text-sm text-[#666] font-medium">Style</span>
            <Image src={Refresh} alt="Refresh" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-4">
          {projects &&
            projects.map((project) => (
              <div
                key={project.id}
                className="w-full gap-5 flex items-center justify-between flex-row p-5 bg-white border border-[#E5E5E5] rounded-[12px] shadow-project-card"
              >
                <div className="w-14 h-14 relative">
                  <Image
                    src={project.image || DefaultImage}
                    alt="Project Image"
                    fill
                    className="object-cover border-[1.56px] border-white rounded-[6.22px] shadow-project-image"
                  />
                </div>
                <div className="flex-1 flex-row items-stretch">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-[#64748B] text-sm">
                    {project.description || 'Add Project Description'}
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <div className="bg-[#EEFBF4] rounded-[8px] px-2 py-1">
                    <span className="text-[#17663A] text-sm">Active</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <Button variant="link" className="gap-x-1 hover:no-underline">
          <Image src={EyeEdit} alt="Eye Edit" />
          <span className="text-[10px] text-[#999999] font-normal">
            PROFILE PREVIEW
          </span>
        </Button>
        <Button
          variant="default"
          size="lg"
          className="gap-x-2 hover:no-underline bg-[#272727] hover:bg-[#2f2f2f] border border-[#535353] ring-1 ring-[#272727]"
        >
          <Image src={Magic} alt="Magic" />
          <span className="text-base text-white font-medium">Deploy</span>
        </Button>
      </div>
    </div>
  );
};
