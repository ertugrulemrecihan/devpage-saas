import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/rtk-hooks';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

import GithubIcon from '@/public/assets/icons/github';
import XIcon from '@/public/assets/icons/x';
import YouTubeIcon from '@/public/assets/icons/youtube';
import InstagramIcon from '@/public/assets/icons/instagram';
import InstagramGradientIcon from '@/public/assets/icons/instagram-gradient';
import DribbbleIcon from '@/public/assets/icons/dribbble';
import LinkedInIcon from '@/public/assets/icons/linkedin';
import MailIcon from '@/public/assets/icons/mail';

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
  variant?: 'fill' | 'line' | 'ghost';
}

type ButtonStyle = {
  icon: React.ReactNode;
  background: string;
  border?: string;
  textColor?: string;
};

export const SocialMediaButton = ({
  type,
  url,
  isOpenable = false,
  variant = 'fill',
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
      icon: (
        <GithubIcon
          width={18}
          height={18}
          variant={variant === 'fill' ? 'fill' : 'line'}
        />
      ),
      background: '#0F141A',
      textColor: variant === 'fill' ? '#FFFFFF' : '#0F141A',
      border: '#0F141A',
    },
    x: {
      icon: (
        <XIcon
          width={18}
          height={18}
          variant={variant === 'fill' ? 'fill' : 'line'}
        />
      ),
      background: '#1D9BF0',
      textColor: variant === 'fill' ? '#FFFFFF' : '#1D9BF0',
      border: '#1D9BF0',
    },
    youtube: {
      icon: (
        <YouTubeIcon
          width={18}
          height={18}
          variant={variant === 'fill' ? 'fill' : 'line'}
        />
      ),
      background: '#FC0B1C',
      textColor: variant === 'fill' ? '#FFFFFF' : '#FC0B1C',
      border: '#FC0B1C',
    },
    instagram: {
      icon:
        variant === 'fill' ? (
          <InstagramIcon width={18} height={18} />
        ) : (
          <InstagramGradientIcon width={18} height={18} />
        ),
      background:
        'radial-gradient(102.88% 102.89% at 60.65% 104.95%, rgba(140, 58, 170, 0.00) 64%, #8C3AAA 100%), radial-gradient(130.54% 130.55% at 13.29% 100.47%, #FA8F21 9%, #D82D7E 78%)',
      textColor: variant === 'fill' ? '#FFFFFF' : '#8C3AAA',
      border: '#8C3AAA',
    },
    dribbble: {
      icon: <DribbbleIcon width={18} height={18} />,
      background: '#FFABE7',
      textColor: variant === 'fill' ? '#FFFFFF' : '#FFABE7',
      border: '#FFABE7',
    },
    linkedin: {
      icon: (
        <LinkedInIcon
          width={18}
          height={18}
          variant={variant === 'fill' ? 'fill' : 'line'}
        />
      ),
      background: '#006699',
      textColor: variant === 'fill' ? '#FFFFFF' : '#006699',
      border: '#006699',
    },
    email: {
      icon: <MailIcon width={18} height={18} />,
      background: '#FDFDFD',
      border: '1px solid #E5E5E5',
      textColor: '#111111',
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
  }, [type, variant]);

  return (
    <div
      ref={linkRef}
      className={cn(
        'px-2 rounded-lg cursor-pointer shadow-social-media-icon flex items-center justify-center h-9 min-w-9'
      )}
      style={{
        background:
          variant === 'fill' ? buttonStyle?.background : 'transparent',
        border:
          variant === 'ghost'
            ? '1px solid #E5E5E5'
            : variant === 'line'
            ? `1px solid ${buttonStyle?.border}`
            : 'none',
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
      {buttonStyle?.icon && buttonStyle.icon}
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
                { 'placeholder:text-slate-500': variant !== 'fill' },
                props.className
              )}
              style={{
                color: buttonStyle?.textColor,
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
