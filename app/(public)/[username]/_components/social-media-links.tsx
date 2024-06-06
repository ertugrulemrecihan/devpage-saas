import { SocialMediaButton } from '@/components/social-media-button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useAppSelector } from '@/lib/rtk-hooks';
import { useEffect, useState } from 'react';

const SocialMediaLinks = () => {
  const profileUser = useAppSelector((state) => state.profile.user);
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const currentUser = useCurrentUser();

  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);
  return (
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
  );
};

export default SocialMediaLinks;
