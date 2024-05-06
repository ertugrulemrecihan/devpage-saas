import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { UsernameSchema } from '@/schemas';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setUsername } from '@/actions/set-username';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCallback, useEffect, useState, useTransition } from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const UsernameForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const user = useCurrentUser();
  const hasUsername = !!user?.username;

  const [error, setError] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const form = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = (values: z.infer<typeof UsernameSchema>) => {
    startTransition(() => {
      setUsername(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            update();
            toast({
              title: 'Success!',
              description: data.success,
            });
          }
        })
        .catch(() => {
          setError('Something went wrong. Please try again later.');
        });
    });
  };

  const addUsernameFromUrl = useCallback(() => {
    if (hasUsername || !username) {
      return;
    }

    startTransition(() => {
      setUsername({ username })
        .then((data) => {
          if (data?.error) {
            return;
          }

          if (data?.success) {
            update();
            router.replace('/panel');
          }
        })
        .catch(() => {
          return;
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    addUsernameFromUrl();
  }, [addUsernameFromUrl]);

  if (hasUsername) {
    return null;
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="p-5 border rounded-md flex flex-col items-start justify-center shadow-sm space-y-3">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ertugrulchn"
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                You can add your username here. Remember, you will not be able
                to change it again later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button disabled={isPending} type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
};
