import * as z from 'zod';
import { useState, useTransition } from 'react';
import { ProjectSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { ProjectWithOthers } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { createProject } from '@/actions/project';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/lib/rtk-hooks';
import { setProjects } from '@/lib/features/projects/projectsSlice';

export const AddProjectForm = () => {
  const dispatch = useAppDispatch();

  const [isFormPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ProjectSchema>) => {
    startTransition(() => {
      createProject(values)
        .then((data) => {
          if (data?.project) {
            dispatch(setProjects(data.project));

            toast({
              duration: 3000,
              title: 'Success!',
              description: 'Project has been created!',
            });
          }

          if (data?.error) {
            toast({
              duration: 3000,
              title: 'Error!',
              description: data.error,
            });
          }
        })
        .catch((error) => {
          toast({
            duration: 3000,
            title: 'Error!',
            description: error.message,
          });
        });
    });
  };

  const handleFormOpen = () => {
    if (!isFormOpen) return setIsFormOpen(true);

    const { name } = form.getValues();

    if (!name) {
      return setIsFormOpen(false);
    }

    form.handleSubmit(onSubmit)();
    form.reset();

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      {isFormOpen && (
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full h-14">
                  <Input
                    {...field}
                    placeholder="Project Name"
                    disabled={isFormPending}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      )}
      <div className="w-full h-14">
        <Button
          onClick={handleFormOpen}
          className="w-full h-full flex items-center gap-2 uppercase font-semibold"
        >
          <PlusIcon className="w-6 h-6" />
          Add Project
        </Button>
      </div>
    </div>
  );
};
