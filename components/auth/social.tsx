'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from '@tabler/icons-react';

interface SocialProps {
  callbackUrl?: string;
}

export const Social = ({ callbackUrl }: SocialProps) => {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: callbackUrl || '/auth/login' });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <div className="flex items-center w-full gap-x-4">
        <Button
          size="lg"
          className="w-full gap-x-2"
          variant="outline"
          onClick={() => onClick('github')}
        >
          <IconBrandGithubFilled className="h-5 w-5" />
          <span className="text-[#333333] text-base font-medium">GitHub</span>
        </Button>

        <Button
          size="lg"
          className="w-full gap-x-2"
          variant="outline"
          onClick={() => onClick('google')}
        >
          <IconBrandGoogleFilled className="h-5 w-5 text-[#1D9BF0]" />
          <span className="text-[#1D9BF0] text-base font-medium">Google</span>
        </Button>
      </div>
    </div>
  );
};
