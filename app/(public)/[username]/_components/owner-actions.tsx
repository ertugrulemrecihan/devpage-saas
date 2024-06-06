import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { setEditingMode } from '@/lib/features/profile/profileSlice';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import Phone from '@/public/assets/icons/phone.svg';
import Settings from '@/public/assets/icons/settings';

const OwnerActions = () => {
  const dispatch = useAppDispatch();
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
    <AnimatePresence>
      {isOwner ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Button
            variant="outline"
            onClick={() => {
              if (isOwner && !isPageEditing) {
                dispatch(setEditingMode(true));
              } else {
                // TODO: Add device preview
              }
            }}
          >
            {isPageEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2"
              >
                <Image src={Phone} alt="Phone" />
                <span>Device Preview</span>
              </motion.div>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Edit Profile
              </motion.span>
            )}
          </Button>
          <Button
            variant="outline"
            className={cn({
              'w-9 h-9': !isPageEditing,
              'text-[#B91C1C]': isPageEditing,
            })}
            size={isPageEditing ? 'default' : 'icon'}
            onClick={() => {
              if (isOwner && !isPageEditing) {
                // TODO: Add user settings
              } else {
                dispatch(setEditingMode(false));
              }
            }}
          >
            {isPageEditing ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Exit
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Settings stroke="#333" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      ) : (
        <div></div>
      )}
    </AnimatePresence>
  );
};

export default OwnerActions;
