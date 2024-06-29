'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { BeatLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';

import CardWrapper from '@/components/auth/card-wrapper';
import { newVerification } from '@/actions/new-verification';
import { Button } from '../ui/button';

import EmailVerificationError from '@/public/assets/images/EmailVerificationError.png';
import EmailVerificationSuccess from '@/public/assets/images/EmailVerificationSuccess.png';
import Image from 'next/image';

export const NewVerificationForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Token is missing!');
      return;
    }

    startTransition(async () => {
      await newVerification(token)
        .then((data) => {
          setSuccess(data.success);
          setError(data.error);
        })
        .catch(() => {
          setError('Something went wrong!');
        });
    });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardWrapper
      headerTitle="Email verification"
      headerLabel={
        !success && !error ? (
          'We are verifying your email address...'
        ) : success ? (
          <span className="text-2xl font-normal text-[#15803D]">
            Yes, you&apos;re in. You can go and check in right now.
          </span>
        ) : (
          <span className="text-2xl font-normal text-[#B91C1C]">
            an error occurred try again
          </span>
        )
      }
    >
      <div className="flex flex-col gap-y-[72px] items-center w-full justify-center">
        {((!success && !error) || isPending) && <BeatLoader />}
        {success && (
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Image
              src={EmailVerificationSuccess}
              alt="Email Verification Success"
            />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Image
              src={EmailVerificationError}
              alt="Email Verification Error"
            />
          </div>
        )}
        {!isPending && (
          <div className="flex flex-col items-center justify-center gap-y-4">
            {error && (
              <Button
                className="w-[155px] bg-[#272727] hover:bg-[#2e2e2e] border border-[#535353] ring-[1px] ring-[#272727] select-none"
                onClick={() => {
                  router.push('/auth/verification');
                }}
              >
                Send Again
              </Button>
            )}
            <Button
              variant="outline"
              className="w-[155px]"
              onClick={() => {
                router.push('/auth/login');
              }}
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};
