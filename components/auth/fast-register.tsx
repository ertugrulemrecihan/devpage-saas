'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FastRegisterSchema } from '@/schemas';
import { useRouter } from 'next/navigation';

interface FastRegisterProps {
  residential?: 'sideBySide' | 'underEachOther';
}

export const FastRegister = ({
  residential = 'sideBySide',
}: FastRegisterProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FastRegisterSchema>>({
    resolver: zodResolver(FastRegisterSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = (values: z.infer<typeof FastRegisterSchema>) => {
    router.push(`/panel?username=${values.username}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            'flex items-start justify-between w-[500px] gap-4',
            residential === 'sideBySide' ? 'flex-row' : 'flex-col',
            { 'gap-3': residential === 'underEachOther' }
            // { 'min-h-[100px]': residential === 'sideBySide' }
          )}
        >
          <div
            className={cn('w-3/5 h-full space-y-2', {
              'w-full': residential === 'underEachOther',
            })}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    'w-full h-[56px] border border-input rounded-md bg-slate-900 '
                  )}
                >
                  <div className="w-full h-full flex items-center gap-1">
                    <FormLabel className="ml-3 font-medium text-white">
                      devpa.ge/
                    </FormLabel>
                    <FormControl className="flex items-center">
                      <Input
                        {...field}
                        placeholder="ertugrulchn"
                        className="h-full border-none shadow-none outline-none focus-visible:ring-0 text-white p-0"
                        autoComplete='off'
                        type="text"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            {form.formState.errors && (
              <p
                className={cn(
                  'w-full text-start text-[0.8rem] font-medium text-destructive'
                )}
              >
                {form.formState.errors.username?.message}
              </p>
            )}
          </div>
          <div
            className={cn('w-2/5 h-full', {
              'w-full': residential === 'underEachOther',
            })}
          >
            <Button
              className={cn(
                'w-full h-[56px] uppercase font-semibold rounded-md'
              )}
              variant="outline"
            >
              Create My Page
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
