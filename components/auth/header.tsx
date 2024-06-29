import { Button } from '@/components/ui/button';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  headerTitle: string | React.ReactNode;
  label?: string | React.ReactNode;
  backButtonHref?: string | (() => void);
  showBackButton?: boolean;
  username?: string;
}

export const Header = ({
  headerTitle,
  label,
  backButtonHref,
  showBackButton = false,
  username,
}: HeaderProps) => {
  const navigation = useRouter();

  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      {showBackButton && (
        <div className="w-full flex justify-start">
          <Button
            variant="ghost"
            className="px-3 py-2 gap-x-2"
            onClick={
              typeof backButtonHref === 'string'
                ? () => navigation.push(backButtonHref)
                : backButtonHref
            }
          >
            <IconChevronLeft size={20} className="text-[#2E2E2E]" />
            <span className="text-base font-medium text-[#2E2E2E]">Back</span>
          </Button>
        </div>
      )}
      {username && (
        <div className="w-full flex justify-center">
          <span className="text-[#999] text-xl font-medium text-center">
            @{username}
          </span>
        </div>
      )}
      <h1 className="w-full text-5xl leading-normal font-medium text-black text-center">
        {headerTitle}
      </h1>
      {label && <p className="text-2xl text-[#666] text-center">{label}</p>}
    </div>
  );
};
