'use client';

import { useEffect, useState } from 'react';
import { logout } from '@/actions/logout';
import { useAppSelector } from '@/lib/rtk-hooks';
import { useCurrentUser } from '@/hooks/use-current-user';

import { Button } from '@/components/ui/button';
import { IconLogout } from '@tabler/icons-react';

export const LogoutButton = () => {
  const profileUser = useAppSelector((state) => state.profile.user);

  const currentUser = useCurrentUser();

  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
  }, [currentUser, profileUser]);

  const onClick = () => {
    logout();
  };

  return (
    isOwner && (
      <div className="absolute bottom-0 right-0 flex items-end justify-end px-12 py-12">
        <Button
          onClick={onClick}
          className="cursor-pointer gap-x-2"
          variant="outline"
        >
          <IconLogout size={20} className="text-[#B91C1C]" />
          <span className="font-medium text-base text-[#B91C1C]">Log Out</span>
        </Button>
      </div>
    )
  );
};
