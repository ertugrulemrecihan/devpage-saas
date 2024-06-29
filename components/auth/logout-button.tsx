'use client';

import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import { IconLogout } from '@tabler/icons-react';

export const LogoutButton = () => {
  const onClick = () => {
    logout();
  };

  return (
    <Button
      onClick={onClick}
      className="cursor-pointer gap-x-2"
      variant="outline"
    >
      <IconLogout size={20} className="text-[#B91C1C]" />
      <span className="font-medium text-base text-[#B91C1C]">Log Out</span>
    </Button>
  );
};
