'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import LinquesLogo from '@/public/assets//images/logo.svg';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white auth-container flex flex-col gap-y-4">
      <motion.div
        initial={{ opacity: 0, marginTop: '0' }}
        animate={{ opacity: 1, marginTop: '112px' }}
        transition={{ duration: 0.3 }}
        className="w-full flex justify-center mt-28"
      >
        <Image src={LinquesLogo} alt="Linques Logo" />
      </motion.div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
