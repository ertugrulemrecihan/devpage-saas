'use client';

import * as z from 'zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '@/actions/register';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { clearUsername } from '@/lib/features/register/registerSlice';

import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CardWrapper from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { Social } from './social';
import { UsernameInput } from '@/components/auth/username-input';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

import CheckEmail from '@/public/assets/images/CheckEmail.png';
import Image from 'next/image';
import { toast } from '../ui/use-toast';

const RegisterForm = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const registerUsername = useAppSelector((state) => state.register.username);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [success, setSuccess] = useState<string | undefined>('');
  const [passwordIsHide, setPasswordIsHide] = useState<boolean>(true);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (pathname !== '/auth/register') {
      dispatch(clearUsername());
    }
  }, [pathname]);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      username: registerUsername as string | '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    values.username = registerUsername as string;

    startTransition(() => {
      register(values, callbackUrl as string).then((data) => {
        if (!data) return;
        if (data.error) {
          setSuccess('');
          toast({
            title: 'Error!',
            description: data.error,
            variant: 'error',
            duration: 2000,
          });
        }
        if (data.success) {
          form.reset();
          toast({
            title: 'Success!',
            description: data.success,
            variant: 'success',
            duration: 2000,
          });
          setSuccess(data.success);
        }
      });
    });
  };

  if (success && success === 'Confirmation email sent!') {
    return (
      <CardWrapper
        headerTitle="Check your email"
        headerLabel="we sent you a confirmation email"
      >
        <div className="w-full flex flex-col items-center justify-center gap-y-[120px]">
          <Image src={CheckEmail} alt="Check Email" />
          <Button
            onClick={() => {
              setSuccess('');
            }}
            variant="outline"
            className="w-[196px] h-10"
          >
            Back
          </Button>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      headerTitle={
        registerUsername ? 'Create your account' : 'Create your username'
      }
      headerLabel={
        registerUsername
          ? 'linked to your username'
          : 'people will find you by that name'
      }
      backButtonHref={() => {
        if (registerUsername) {
          dispatch(clearUsername());
          form.reset();
          form.clearErrors();
        }
      }}
      showBackButton={!!registerUsername}
      username={registerUsername ? `${registerUsername}` : undefined}
    >
      {!registerUsername && <UsernameInput />}
      {registerUsername && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="gap-y-[6px]">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Write your full name"
                        className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="gap-y-[6px]">
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
                  <FormItem className="gap-y-[6px]">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="w-full h-full relative">
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Write your password"
                          className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                          type={passwordIsHide ? 'password' : 'text'}
                        />
                        <div className=" h-full flex items-center absolute top-0 right-3">
                          {passwordIsHide ? (
                            <IconEye
                              size={20}
                              onClick={() => setPasswordIsHide(!passwordIsHide)}
                              className="text-[#999] cursor-pointer"
                            />
                          ) : (
                            <IconEyeOff
                              size={20}
                              onClick={() => setPasswordIsHide(!passwordIsHide)}
                              className="text-[#999] cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center flex-col gap-y-4">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full bg-[#272727] hover:bg-[#2e2e2e] border border-[#535353] ring-[1px] ring-[#272727] select-none"
              >
                Register
              </Button>
              <span className="text-[#999] text-sm font-normal">OR</span>
              <Social callbackUrl={callbackUrl || undefined} />
            </div>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default RegisterForm;
