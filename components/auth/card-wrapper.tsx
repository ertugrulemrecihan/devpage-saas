'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Header } from '@/components/auth/header';

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string | React.ReactNode;
  headerLabel?: string | React.ReactNode;
  backButtonHref?: string | (() => void);
  showBackButton?: boolean;
  username?: string;
}

const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonHref,
  showBackButton,
  username,
}: CardWrapperProps) => {
  return (
    <Card className="border-none shadow-none bg-transparent px-0 py-0 flex flex-col gap-y-14 max-w-[469px] md:w-[469px]">
      <CardHeader className="p-0">
        <Header
          headerTitle={headerTitle}
          label={headerLabel}
          backButtonHref={backButtonHref}
          showBackButton={showBackButton}
          username={username}
        />
      </CardHeader>
      <CardContent className="px-[16.5px]">{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
