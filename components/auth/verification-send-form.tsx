'use client';

import * as z from 'zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendEmailVerificationMessage } from '@/actions/verification';

import { VerificationSendSchema } from '@/schemas';
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
import { toast } from '@/components/ui/use-toast';

const VerificationSendForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof VerificationSendSchema>>({
    resolver: zodResolver(VerificationSendSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof VerificationSendSchema>) => {
    startTransition(() => {
      sendEmailVerificationMessage(values).then((data) => {
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
      headerTitle="Reset Password"
      headerLabel="enter the email you want us to send"
      backButtonHref="/auth/login"
      showBackButton
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
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
                      placeholder="Write email"
                      className="p-3 h-11 text-sm font-normal placeholder:text-[#999] border-[#E5E5E5] rounded-lg"
                      type="email"
                    />
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
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default VerificationSendForm;
