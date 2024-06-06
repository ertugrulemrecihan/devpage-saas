import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InlineEditProps extends React.InputHTMLAttributes<HTMLInputElement> {
  viewText?: string;
  viewElement?: React.ReactNode | JSX.Element;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputStyle?: string;
}

export const InlineEdit = ({
  viewText,
  viewElement,
  placeholder,
  value,
  onChange,
  inputStyle,
  ...props
}: InlineEditProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputWidth, setInputWidth] = useState<string>('10ch');

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

  const calculateInputWidth = (value: string) => {
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    span.style.visibility = 'hidden';
    span.className = cn('text-base', inputStyle);
    span.textContent = value || placeholder || '';
    document.body.appendChild(span);
    const width = `${span.offsetWidth + 1}px`;
    document.body.removeChild(span);
    return width;
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);

    setInputWidth(calculateInputWidth(e.target.value));
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        onKeyDown={(e) => {
          e.key === 'Escape' && setIsEditing(false);
        }}
        placeholder={placeholder || 'Enter Text'}
        defaultValue={value}
        autoFocus
        onChange={handleOnChange}
        className={cn(
          'shadow-none p-0 px-0 focus-within:ring-0 focus-visible:ring-0 border-none text-base rounded-none',
          inputStyle
        )}
        style={{ width: inputWidth }}
        onFocus={(e) => {
          setInputWidth(calculateInputWidth(e.target.value));
        }}
        {...props}
        onBlur={(e) => {
          setIsEditing(false);
          props.onBlur && props.onBlur(e);
        }}
      />
    );
  }
};
