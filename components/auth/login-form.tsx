'use client';

import * as z from 'zod';
import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Social } from './social';
import { login } from '@/actions/login';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import CardWrapper from '@/components/auth/card-wrapper';

const LoginForm = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with diffrent provider'
      : searchParams.get('error') === 'AccountNotFound'
      ? 'Account not found'
      : '';

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  if (urlError) {
    toast({
      title: 'Error!',
      description: urlError,
      variant: 'error',
      duration: 2000,
    });
  }

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values, callbackUrl as string)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast({
              title: 'Error!',
              description: data.error,
              variant: 'error',
              duration: 2000,
            });
          }

          if (data?.success) {
            form.reset();
            toast({
              title: 'Success!',
              description: data.success,
              variant: 'success',
              duration: 2000,
            });
            setTimeout(() => {
              window.location.href = data.callbackUrl as string;
            }, 1000);
          }
        })
        .catch(() => {
          form.reset();
          toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'error',
            duration: 2000,
          });
        });
    });
  };

  return (
    <CardWrapper
      headerTitle={
        <span className="text-5xl text-black font-medium text-center">
          Log in to your <span className="text-[#6BB696]">linques</span>
        </span>
      }
    >
      <div className="w-full flex flex-col items-center justify-center gap-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <div className="w-full space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Write your email"
                        className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                        placeholder="Write your password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="link"
              size="sm"
              asChild
              className="px-0 text-sm text-[#999] font-normal"
            >
              <Link href="/auth/reset">Reset Password?</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#272727] py-2 hover:bg-[#2e2e2e] border border-[#535353] ring-[1px] ring-[#272727]"
            >
              Login
            </Button>
          </form>
        </Form>
        <span className="text-[#999] text-sm font-normal text-center">OR</span>
        <Social callbackUrl={callbackUrl || undefined} />
        <Button
          onClick={() => {
            router.push('/auth/register');
          }}
          variant="outline"
          className="w-full px-2"
        >
          Sign Up
        </Button>
      </div>
    </CardWrapper>
  );
};

export default LoginForm;
