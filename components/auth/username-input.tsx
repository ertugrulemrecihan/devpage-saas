import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsernameSchema } from '@/schemas';
import { useEffect, useState, useTransition } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

export const UsernameInput = () => {
  const dispatch = useAppDispatch();

  const [timer, setTimer] = useState<number | NodeJS.Timeout>(1250);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  useEffect(() => {
    const handleClearSession = async () => {
      await clearUsernameSession();
      dispatch(clearUsername());
    };

    handleClearSession();
  }, []);

  const onChange = (values: z.infer<typeof UsernameSchema>) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      startTransition(() => {
        checkUsername(values.username).then((data) => {
          if (!data) return;
          if (data.error) {
            setError(data.error);
            setSuccess('');
          }

          if (data.success) {
            setError('');
            setSuccess(data.success);
          }
        });
      });
    }, 1250);

    setTimer(newTimer);
  };

  const saveUsername = () => {
    if (error) return;

    const username = form.getValues('username');

    if (!username) {
      setError('Please enter a username!');
    }

    if (success) {
      // dispatch(setUsername(username));
      startTransition(() => {
        dispatch(setUsername(username));
        saveUsernameInSession(username);
      });
    }
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="w-full h-11 relative">
                    <Input
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={saveUsername}
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
