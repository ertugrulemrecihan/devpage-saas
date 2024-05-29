import { ChangeEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type InlineEditProps = {
  viewText?: string;
  viewElement?: React.ReactNode | JSX.Element;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: string;
};

export const InlineEdit = ({
  viewText,
  viewElement,
  placeholder,
  value,
  onChange,
  inputStyle,
}: InlineEditProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (viewElement && !isEditing) {
    return (
      <div
        onClick={() => {
          setIsEditing(true);
        }}
      >
        {viewElement}
      </div>
    );
  } else if (!viewElement && !isEditing) {
    return (
      <span
        className="text-base text-[#808080]"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        {viewText || 'Inline Edit'}
      </span>
    );
  }

  if (isEditing) {
    return (
      <Input
        onKeyDown={(e) => {
          e.key === 'Escape' && setIsEditing(false);
        }}
        placeholder={placeholder || 'Enter Text'}
        defaultValue={value}
        autoFocus
        onChange={onChange}
        className={cn(
          'shadow-none p-0 focus-within:ring-0 focus-visible:ring-0 border-none text-base rounded-none',
          inputStyle
        )}
        onBlur={() => {
          setIsEditing(false);
        }}
      />
    );
  }

  return <div>Hello</div>;
};
