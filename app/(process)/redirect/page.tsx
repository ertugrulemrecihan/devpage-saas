'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { RedirectType, redirect } from 'next/navigation';
import { useEffect } from 'react';
import { BeatLoader } from 'react-spinners';

const Redirect = () => {
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) {
      return redirect('/auth/login', RedirectType.replace);
    } else {
      return redirect(`/${user.username}`, RedirectType.replace);
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <BeatLoader color="#3B82F6" />
    </div>
  );
};

export default Redirect;
