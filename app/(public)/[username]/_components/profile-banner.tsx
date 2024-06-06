import { ProfileBackground } from '@/components/profile-background';
import { useAppSelector } from '@/lib/rtk-hooks';
import { ProfileBackgroundColorsType } from '@/types';
import { profileBackgroundColors } from '@/utils/profile-background-colors';
import { useEffect, useState } from 'react';

type ProfileBackgroundProps = {
  backgroundColor: string;
  borderColors: {
    from: string;
    to: string;
  };
};

const ProfileBanner = () => {
  const profileUser = useAppSelector((state) => state.profile.user);

  const [profileBackground, setProfileBackground] =
    useState<ProfileBackgroundProps | null>();

  useEffect(() => {
    if (profileUser) {
      const backgroundStyle = profileUser?.userPage?.backgroundStyle
        .toLocaleLowerCase()
        .toString();

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
  }, [profileUser]);

  return (
    profileBackground && (
      <div className="absolute top-0 left-0 w-full z-0">
        <ProfileBackground
          backgroundColor={profileBackground.backgroundColor}
          borderColors={profileBackground.borderColors}
        />
      </div>
    )
  );
};

export default ProfileBanner;
