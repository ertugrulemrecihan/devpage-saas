'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPassword } from '@/actions/new-password';
import { NewPasswordSchema } from '@/schemas';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper';
import { toast } from '@/components/ui/use-toast';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const NewPasswordForm = () => {
  const [passwordIsHide, setPasswordIsHide] = useState<{
    id: string;
    isHide: boolean;
  }>({
    id: '',
    isHide: true,
  });

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (!data) return;
        if (data.error) {
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
        }
      });
    });
  };

  return (
    <CardWrapper
      headerTitle="New Password"
      headerLabel="Set the new password you want to use for future logins"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="w-full h-full relative">
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Write new password"
                        className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                        type={
                          passwordIsHide.id === field.name &&
                          passwordIsHide.isHide
                            ? 'password'
                            : 'text'
                        }
                      />
                      <div className=" h-full flex items-center absolute top-0 right-3">
                        {passwordIsHide.id === field.name &&
                        passwordIsHide.isHide ? (
                          <IconEye
                            size={20}
                            onClick={() =>
                              setPasswordIsHide({
                                id: field.name,
                                isHide: false,
                              })
                            }
                            className="text-[#999] cursor-pointer"
                          />
                        ) : (
                          <IconEyeOff
                            size={20}
                            onClick={() =>
                              setPasswordIsHide({
                                id: field.name,
                                isHide: true,
                              })
                            }
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="w-full h-full relative">
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Write confirm password"
                        className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                        type={
                          passwordIsHide.id === field.name &&
                          passwordIsHide.isHide
                            ? 'password'
                            : 'text'
                        }
                      />
                      <div className=" h-full flex items-center absolute top-0 right-3">
                        {passwordIsHide.id === field.name &&
                        passwordIsHide.isHide ? (
                          <IconEye
                            size={20}
                            onClick={() =>
                              setPasswordIsHide({
                                id: field.name,
                                isHide: false,
                              })
                            }
                            className="text-[#999] cursor-pointer"
                          />
                        ) : (
                          <IconEyeOff
                            size={20}
                            onClick={() =>
                              setPasswordIsHide({
                                id: field.name,
                                isHide: true,
                              })
                            }
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
          <Button
            type="submit"
            disabled={
              isPending ||
              form.formState.isSubmitting ||
              !form.formState.isValid
            }
            className="w-full bg-[#272727] hover:bg-[#2e2e2e] border border-[#535353] ring-[1px] ring-[#272727] select-none"
          >
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
