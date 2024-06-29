import { UsernameSchema } from '@/schemas';
import { useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  checkUsername,
  clearUsernameSession,
  saveUsernameInSession,
} from '@/actions/register';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useAppDispatch } from '@/lib/rtk-hooks';
import {
  clearUsername,
  setUsername,
} from '@/lib/features/register/registerSlice';
import { IconLogin } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const UsernameInput = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [timer, setTimer] = useState<number | NodeJS.Timeout>(1250);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [stateUsername, setStateUsername] = useState<string>('');

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleClearSession = async () => {
      await clearUsernameSession();
      dispatch(clearUsername());
    };

    handleClearSession();
  }, []);

  const onChange = (username: string) => {
    setSuccess('');
    setError('');

    const validatedUsername = UsernameSchema.safeParse({ username });

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      if (validatedUsername.success && !validatedUsername.error) {
        startTransition(() => {
          checkUsername(username).then((data) => {
            if (!data) return;
            if (data.error) {
              setError(data.error);
              setSuccess('');
            }

            if (data.success) {
              setError('');
              setSuccess(data.success);
              setStateUsername(username);
            }
          });
        });
      }
    }, 1250);

    setTimer(newTimer);

    if (!validatedUsername.success) {
      setError(validatedUsername.error.errors[0].message);
    }
  };

  const saveUsername = () => {
    if (error) return;

    if (!stateUsername) {
      setError('Please enter a username!');
    }

    if (success) {
      // dispatch(setUsername(username));
      startTransition(() => {
        dispatch(setUsername(stateUsername));
        saveUsernameInSession(stateUsername);
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-11 relative">
        <Input
          onChange={(e) => onChange(e.target.value)}
          placeholder="ertugrulchn"
          className="w-full h-full"
          disabled={isPending}
        />
        {isPending && (
          <div className="absolute h-full right-0 top-0">
            <div className="flex items-center pr-2 w-full h-full">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="flex items-center flex-col gap-y-4">
        <Button
          type="button"
          className="w-full bg-[#272727] hover:bg-[#2e2e2e] border border-[#535353] ring-[1px] ring-[#272727]"
          disabled={isPending}
          onClick={saveUsername}
        >
          Next
        </Button>
        <span className="text-[#999] text-sm">OR</span>
        <Button
          variant="link"
          className="gap-x-2"
          onClick={() => {
            router.push('/auth/login');
          }}
        >
          <IconLogin className="h-5 w-5 text-black" />
          <span className="text-[#2E2E2E] text-sm">Log In</span>
        </Button>
      </div>
    </div>
  );
};
