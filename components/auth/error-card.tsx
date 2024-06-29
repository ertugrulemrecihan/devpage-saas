import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import CardWrapper from '@/components/auth/card-wrapper';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerTitle="Oops! Something went wrong!"
      headerLabel="Oops! Something went wrong!"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
