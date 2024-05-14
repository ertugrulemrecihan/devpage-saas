'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { UserWithUserPage } from '@/types';
import { UserPageDetailsSchema } from '@/schemas';
import { useAutoSave } from '@/hooks/use-auto-save';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { updateUserPageDetails } from '@/actions/user-page';
import { useAppDispatch, useAppSelector } from '@/lib/rtk-hooks';
import { setUser as rtkSetUser } from '@/lib/features/user/userSlice';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { toast } from '@/components/ui/use-toast';

import { FcRight } from 'react-icons/fc';
import { IoLocationSharp } from 'react-icons/io5';

export const UserPageDetails = () => {
  const rtkUser = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [user, setUser] = useState<UserWithUserPage | undefined>(rtkUser);

  useEffect(() => {
    setUser(rtkUser);
  }, [rtkUser]);

  const [isFormPending, setFormTransition] = useTransition();

  const form = useForm<z.infer<typeof UserPageDetailsSchema>>({
    resolver: zodResolver(UserPageDetailsSchema),
    values: {
      name: user?.name || '',
      biography: user?.userPage?.biography || undefined,
      location: user?.userPage?.location || undefined,
    },
  });

  const updateUserDetails = async (
    data: z.infer<typeof UserPageDetailsSchema>
  ) => {
    if (user) {
      setFormTransition(() => {
        updateUserPageDetails(user?.id, data).then((data) => {
          dispatch(rtkSetUser(data?.user));

          toast({
            title: 'Success!',
            description: data?.success,
          });
        });
      });
    }
  };

  const { dispatchAutoSave } = useAutoSave({
    onSave: updateUserDetails,
  });

  const onSubmit = async (values: z.infer<typeof UserPageDetailsSchema>) => {
    const formLastData = {
      name: user?.name,
      biography: user?.userPage?.biography,
      location: user?.userPage?.location,
    };

    if (JSON.stringify(values) === JSON.stringify(formLastData)) {
      return;
    }

    let updatesObject = {};

    Object.keys(values).forEach((key) => {
      const typedKey = key as keyof typeof values;

      const value = form.watch(typedKey);

      if (value === undefined) return;

      if (value !== formLastData[typedKey]) {
        updatesObject = {
          ...updatesObject,
          [typedKey]: value,
        };
      }
    });

    if (Object.keys(updatesObject).length === 0) {
      return;
    }

    dispatchAutoSave(updatesObject);
  };

  return (
    <div className="w-full p-4 bg-secondary rounded-md">
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full flex items-center justify-between gap-3">
            <div>
              <Avatar>
                {user?.image && (
                  <AvatarImage src={user?.image} alt={user?.name as string} />
                )}
                <AvatarFallback className="uppercase bg-sky-300 text-white font-bold">
                  {user?.name?.slice(0, 2).toString()}
                </AvatarFallback>
              </Avatar>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ertuğrul Emre Cihan"
                      disabled={isFormPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Biography"
                    disabled={isFormPending}
                  />
                </FormControl>
                <FormMessage />

                <HoverCard openDelay={0}>
                  <HoverCardTrigger className="absolute right-3 bottom-2 cursor-help underline text-xs">
                    Markdown Guide
                  </HoverCardTrigger>
                  <HoverCardContent side="top" sideOffset={20}>
                    <p className="text-xs">Format your bio with markdowns ✨</p>
                    <ul className="list-disc list-inside text-xs">
                      <li className="flex items-center gap-5">
                        <span>*Text*</span>
                        <FcRight />
                        <span className="italic">Text</span>
                      </li>
                      <li className="flex items-center gap-5">
                        <span>**Text**</span>
                        <FcRight />
                        <span className="font-bold">Text</span>
                      </li>
                      <li className="flex items-center gap-5">
                        <span>[link](example.com)</span>
                        <FcRight />
                        <span className="underline">Text</span>
                      </li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </FormItem>
            )}
          />
          <div className="w-full flex items-center gap-3">
            <IoLocationSharp size={25} className="text-primary" />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Turkey/Trabzon 🇹🇷"
                      disabled={isFormPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
