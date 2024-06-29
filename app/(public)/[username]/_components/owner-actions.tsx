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
          {!isPageEditing && (
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setEditingMode(true));
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Edit Profile
              </motion.span>
            </Button>
          )}
          {isPageEditing && (
            <Button
              variant="outline"
              className="text-white bg-[#EF4444] ring-[1px] ring-[#EF4444] hover:text-white hover:bg-[#ea5353] border border-[#F87171]"
              size={isPageEditing ? 'default' : 'icon'}
              onClick={() => {
                dispatch(setEditingMode(false));
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Exit
              </motion.span>
            </Button>
          )}
        </motion.div>
      ) : (
        <div></div>
      )}
    </AnimatePresence>
  );
};

export default OwnerActions;
