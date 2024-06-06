import { useAppSelector } from '@/lib/rtk-hooks';
import { motion, AnimatePresence } from 'framer-motion';

const EditModeBadge = () => {
  const isPageEditing = useAppSelector((state) => state.profile.isEditMode);

  return (
    <AnimatePresence>
      {isPageEditing && (
        <motion.div
          initial={{ top: -20, opacity: 0 }}
          animate={{ top: [-20, -20, 40, 40, 0], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute left-0 z-50 w-full flex justify-center"
        >
          <div className="bg-[#A855F7] rounded-b-lg flex items-center justify-center px-4 py-[3px] shadow-edit-mode-badge">
            <span className="text-sm text-white font-medium">Edit Mode</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModeBadge;
