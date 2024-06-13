import { cn } from '@/lib/utils';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';

import X from '@/public/assets/icons/x.svg';
import Github from '@/public/assets/icons/github.svg';
import Youtube from '@/public/assets/icons/youtube.svg';
import Linkedin from '@/public/assets/icons/linkedin.svg';
import Dribbble from '@/public/assets/icons/dribbble.svg';
import Instagram from '@/public/assets/icons/instagram.svg';
import Mail from '@/public/assets/icons/mail.svg';
import { useAppSelector } from '@/lib/rtk-hooks';

interface SocialMediaButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The type of social media button.
   */
  type:
    | 'x'
    | 'youtube'
    | 'github'
    | 'instagram'
    | 'linkedin'
    | 'dribbble'
    | 'email';
  /**
   * The URL to redirect to when the button is clicked.
   */
  url: string;
  isOpenable?: boolean;
}

type ButtonStyle = {
  icon: StaticImageData;
  background: string;
  border?: string;
  inputColor?: string;
};

export const SocialMediaButton = ({
  type,
  url,
  isOpenable = false,
  ...props
}: SocialMediaButtonProps) => {
  const linkRef = useRef<HTMLDivElement>(null);

  const pageIsEditing = useAppSelector((state) => state.profile.isEditMode);

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (linkRef.current && !linkRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const buttonStyles = {
    github: {
      icon: Github,
      background: '#0F141A',
    },
    x: {
      icon: X,
      background: '#1D9BF0',
    },
    youtube: {
      icon: Youtube,
      background: '#FF0000',
    },
    instagram: {
      icon: Instagram,
      background:
        'radial-gradient(102.88% 102.89% at 60.65% 104.95%, rgba(140, 58, 170, 0.00) 64%, #8C3AAA 100%), radial-gradient(130.54% 130.55% at 13.29% 100.47%, #FA8F21 9%, #D82D7E 78%)',
    },
    dribbble: {
      icon: Dribbble,
      background: '#FFABE7',
    },
    linkedin: {
      icon: Linkedin,
      background: '#006699',
    },
    email: {
      icon: Mail,
      background: '#FDFDFD',
      border: '1px solid #E5E5E5',
      inputColor: '#111111',
    },
  };

  useEffect(() => {
    switch (type) {
      case 'x':
        setButtonStyle(buttonStyles.x);
        break;
      case 'youtube':
        setButtonStyle(buttonStyles.youtube);
        break;
      case 'github':
        setButtonStyle(buttonStyles.github);
        break;
      case 'instagram':
        setButtonStyle(buttonStyles.instagram);
        break;
      case 'linkedin':
        setButtonStyle(buttonStyles.linkedin);
        break;
      case 'dribbble':
        setButtonStyle(buttonStyles.dribbble);
        break;
      case 'email':
        setButtonStyle(buttonStyles.email);
        break;
      default:
        setButtonStyle(buttonStyles.github);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div
      ref={linkRef}
      className={cn(
        'px-2 rounded-lg cursor-pointer shadow-social-media-icon flex items-center justify-center h-9 min-w-9'
      )}
      style={{
        background: buttonStyle?.background,
        border: buttonStyle?.border,
      }}
      onClick={() => {
        if (isOpenable) {
          setIsEditing(true);
        }

        if (!pageIsEditing) {
          window.open(url, '_blank');
        }
      }}
    >
      <Image
        src={buttonStyle?.icon || ''}
        alt="Social Media Icon"
        width={18}
        height={18}
      />
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '120px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-2"
          >
            <Input
              className={cn(
                'w-full p-0 shadow-none border-none focus-within:ring-0 focus-visible:ring-0 text-white text-sm placeholder:text-slate-200',
                props.className
              )}
              style={{
                color: buttonStyle?.inputColor,
              }}
              placeholder="Username"
              autoFocus
              {...props}
              onBlur={(e) => {
                setIsEditing(false);
                props.onBlur && props.onBlur(e);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
