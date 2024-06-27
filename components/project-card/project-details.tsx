import { useProjectCardContext } from '@/contexts/project-card-context';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { IconCategory, IconCoin } from '@tabler/icons-react';
import { JetBrains_Mono } from 'next/font/google';
import { InlineEdit } from '../inline-edit';
import React, { useEffect, useState } from 'react';

const font = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
});

interface ProjectCardProps {
  categories?: Category[];
  projectCardIsEditing?: { id: string; isEditing: boolean };
  isValid: boolean;
  onChange: (key: string, value: any) => void;
  setChanges?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const ProjectDetails = ({
  categories,
  projectCardIsEditing,
  onChange,
  setChanges,
}: ProjectCardProps) => {
  const { project } = useProjectCardContext();

  const [values, setValues] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (projectCardIsEditing?.isEditing === false) {
      setValues({ name: '', description: '' });
    }
  }, [projectCardIsEditing]);

  const handleChange = (key: string, value: string) => {
    onChange(key, value);
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setChanges &&
      setChanges((prev) => ({
        ...prev,
        [key]: value,
      }));
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-3 overflow-x-hidden">
      <div className="overflow-x-auto scrollbar-none">
        {projectCardIsEditing?.isEditing &&
        projectCardIsEditing.id === project.id ? (
          <InlineEdit
            viewText={values.name || project.name || 'Add Project Name'}
            defaultValue={values.name || project.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            viewElement={
              <span className="font-medium text-base">
                {values.name || project.name || 'Add Project Name'}
              </span>
            }
            inputStyle="max-w-full text-base font-medium text-[#1A1A1A]"
            placeholder="Add Project Name"
            maxLength={75}
          />
        ) : (
          <span className="font-medium text-base">{project.name}</span>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-none">
        {projectCardIsEditing?.isEditing &&
        projectCardIsEditing.id === project.id ? (
          <InlineEdit
            viewText={
              values.description ||
              project.description ||
              'Add Project Description'
            }
            defaultValue={values.description || project.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            viewElement={
              <p className="font-normal text-sm text-[#666]">
                {values.description ||
                  project.description ||
                  'Add Project Description'}
              </p>
            }
            inputStyle="flex-1 text-sm font-normal text-[#666]"
            placeholder="Add Project Description"
            maxLength={200}
          />
        ) : (
          <p className="font-normal text-sm text-[#666]">
            {project.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-x-2">
        {categories?.find((category) => category.id === project.categoryId) && (
          <div className="flex items-center gap-x-1">
            <IconCategory size={16} stroke={1.5} className="text-[#666]" />
            <span
              className={cn(font.className, 'font-normal text-xs text-[#666]')}
            >
              {
                categories?.find(
                  (category) => category.id === project.categoryId
                )?.name
              }
            </span>
          </div>
        )}

        {project.revenue && project.revenue > 0 ? (
          <div className="flex items-center gap-x-1">
            <IconCoin size={16} stroke={1.5} className="text-[#666]" />
            <span
              className={cn(font.className, 'font-normal text-xs text-[#666]')}
            >
              {project.revenue?.toString()}/mo
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectDetails;
