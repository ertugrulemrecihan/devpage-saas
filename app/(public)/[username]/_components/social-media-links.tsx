import * as z from 'zod';
import { UserForProfile } from '@/types';
import { SocialLinksSchema } from '@/schemas';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import {
  createOrUpdateSocialMediaLink,
  updateUserPageSocialLinksStyle,
} from '@/actions/profile';
import { setProfileUser } from '@/lib/features/profile/profileSlice';

import { SocialMediaButton } from '@/components/social-media-button';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import RefreshIcon from '@/public/assets/icons/refresh';
import { Button } from '@/components/ui/button';
import { SOCIAL_MEDIA_LINK_STYLE } from '@prisma/client';

const SocialMediaLinks = () => {
  const dispatch = useAppDispatch();

  const profileUser = useAppSelector((state) => state.profile.user);
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  const currentUser = useCurrentUser();

  const linkStyles = ['fill', 'line', 'ghost'];

  const [user, setUser] = useState<UserForProfile | undefined>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [linkStyleIndex, setLinkStyleIndex] = useState<number>(0);
  const [variant, setVariant] = useState<'fill' | 'line' | 'ghost'>('fill'); // ['fill', 'line', 'ghost']
  const [errorTimer, setErrorTimer] = useState<number | NodeJS.Timeout>(500);
  const [linkStyleChangeTimer, setLinkStyleChangeTimer] = useState<
    number | NodeJS.Timeout
  >(500);
  const [linkValues, setLinkValues] = useState<
    z.infer<typeof SocialLinksSchema>
  >({
    github: '',
    x: '',
    youtube: '',
    instagram: '',
    dribbble: '',
    linkedin: '',
  });

  const [isPending, autoSaveTransition] = useTransition();

  useEffect(() => {
    if (profileUser) {
      setUser(profileUser);

      const socialLinkStyle =
        profileUser.userPage?.socialMediaLinksStyle.toLowerCase() as
          | 'fill'
          | 'line'
          | 'ghost';
      setVariant(socialLinkStyle);
      setLinkStyleIndex(linkStyles.indexOf(socialLinkStyle));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser]);

  useEffect(() => {
    if (currentUser && profileUser) {
      if (currentUser?.id === profileUser?.id) {
        setIsOwner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, profileUser?.id]);

  useEffect(() => {
    const linkStyle = linkStyles[linkStyleIndex] as 'fill' | 'line' | 'ghost';

    setVariant(linkStyle);

    clearTimeout(linkStyleChangeTimer);

    if (
      linkStyle ===
      (profileUser?.userPage?.socialMediaLinksStyle.toLowerCase() as
        | 'fill'
        | 'line'
        | 'ghost')
    ) {
      return;
    } else {
      const timer = setTimeout(() => {
        dispatchSocialStyleAutoSave({});
      }, 500);
      setLinkStyleChangeTimer(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkStyleIndex]);

  const handleChange = (
    link_provider: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    const validatedValue = SocialLinksSchema.safeParse({
      [link_provider]: value,
    });

    if (validatedValue.success) {
      setLinkValues({
        ...linkValues,
        [link_provider]: value,
      });

      dispatchAutoSave({
        [link_provider]:
          validatedValue.data[
            link_provider as keyof typeof validatedValue.data
          ],
      });
    }

    clearTimeout(errorTimer);

    const timer = setTimeout(() => {
      if (validatedValue.error)
        return toast({
          title: 'Error!',
          description: validatedValue.error.issues[0].message,
          variant: 'error',
          duration: 2000,
        });
    }, 1000);

    setErrorTimer(timer);
  };

  const updateUserDetails = (data: z.infer<typeof SocialLinksSchema>) => {
    if (currentUser && isOwner) {
      autoSaveTransition(async () => {
        await createOrUpdateSocialMediaLink(
          profileUser?.id as string,
          data
        ).then((response) => {
          if (response?.error) {
            return toast({
              title: 'Error!',
              description: response.error,
              variant: 'error',
              duration: 2000,
            });
          }
          if (response?.success) {
            toast({
              title: 'Success!',
              description: response.success,
              variant: 'success',
              duration: 2000,
            });

            const userPage = response.userPage;

            dispatch(
              setProfileUser({
                ...profileUser!,
                userPage: {
                  ...profileUser?.userPage!,
                  ...userPage,
                },
              })
            );
          }
        });
      });
    }
  };

  const { dispatchAutoSave } = useAutoSave({
    onSave: updateUserDetails,
  });

  const updateSocialLinkStyle = async () => {
    if (currentUser && isOwner) {
      const style = linkStyles[linkStyleIndex] as 'fill' | 'line' | 'ghost';

      dispatch(
        setProfileUser({
          ...profileUser!,
          userPage: {
            ...profileUser?.userPage!,
            socialMediaLinksStyle:
              style.toUpperCase() as SOCIAL_MEDIA_LINK_STYLE,
          },
        })
      );

      await updateUserPageSocialLinksStyle(style).then((response) => {
        if (response?.error) {
          return toast({
            title: 'Error!',
            description: response.error,
            variant: 'error',
            duration: 2000,
          });
        }
        if (response?.success) {
          toast({
            title: 'Success!',
            description: response.success,
            variant: 'success',
            duration: 2000,
          });
        }
      });
    }
  };

  const { dispatchAutoSave: dispatchSocialStyleAutoSave } = useAutoSave({
    onSave: updateSocialLinkStyle,
  });

  if (isPageEditing && isOwner) {
    return (
      <div className="flex items-center gap-x-3">
        <Button
          variant="link"
          className="flex items-center gap-x-2 hover:no-underline px-2 py-[0.375rem]"
          onClick={() =>
            setLinkStyleIndex((prev) => {
              if (prev === 2) return 0;
              return (prev = prev + 1);
            })
          }
        >
          <span className="text-sm text-[#666]">Style</span>
          <motion.div
            initial={{ rotate: linkStyleIndex * -90 }}
            animate={{ rotate: linkStyleIndex * -90 }}
            transition={{ duration: 0.2 }}
          >
            <RefreshIcon />
          </motion.div>
        </Button>
        <div className="flex items-start gap-x-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            key={variant + 'github'}
          >
            <SocialMediaButton
              type="github"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.github ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'github'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('github', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={variant + 'x'}
          >
            <SocialMediaButton
              type="x"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.x ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'x'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('x', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            key={variant + 'youtube'}
          >
            <SocialMediaButton
              type="youtube"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.youtube ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'youtube'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('youtube', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            key={variant + 'instagram'}
          >
            <SocialMediaButton
              type="instagram"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.instagram ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'instagram'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('instagram', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            key={variant + 'dribble'}
          >
            <SocialMediaButton
              type="dribbble"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.dribbble ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'dribbble'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('dribbble', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            key={variant + 'linkedin'}
          >
            <SocialMediaButton
              type="linkedin"
              url="#"
              isOpenable={isOwner && isPageEditing}
              defaultValue={
                linkValues.linkedin ||
                user?.userPage?.socialMediaLinks.find(
                  (link) => link.type === 'linkedin'
                )?.username ||
                ''
              }
              onChange={(e) => handleChange('linkedin', e)}
              disabled={isPending}
              variant={variant}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isPageEditing && user?.userPage?.socialMediaLinks) {
    const socialMediaOrder = [
      'github',
      'x',
      'youtube',
      'instagram',
      'dribbble',
      'linkedin',
    ];

    const sortedLinks = user?.userPage?.socialMediaLinks
      .slice()
      .sort((a, b) => {
        const aIndex = socialMediaOrder.indexOf(a.type);
        const bIndex = socialMediaOrder.indexOf(b.type);
        return aIndex - bIndex;
      });

    return (
      <div className="flex items-start gap-x-2">
        {sortedLinks.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 * index }}
          >
            <SocialMediaButton
              url={
                link.type === 'youtube'
                  ? `https://${link.type}.com/@` + link.username
                  : `https://${link.type}.com/` + link.username
              }
              type={link.type as any}
              isOpenable={false}
              variant={
                user.userPage?.socialMediaLinksStyle.toLowerCase() as
                  | 'fill'
                  | 'line'
                  | 'ghost'
              }
            />
          </motion.div>
        ))}
      </div>
    );
  }
};

export default SocialMediaLinks;
