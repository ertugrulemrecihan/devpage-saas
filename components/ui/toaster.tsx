'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import Info from '@/public/assets/icons/info';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant = 'default',
        size = 'sm',
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} size={size} {...props}>
            <div className="w-full h-full flex items-center justify-between gap-2">
              <div
                className={cn('w-full h-full flex gap-2', {
                  'items-center': size === 'sm',
                  'items-start': size === 'big',
                })}
              >
                <Info
                  className="w-4 h-4"
                  fill={
                    variant === 'default'
                      ? '#D1D1DB'
                      : variant === 'warning'
                      ? '#F97316'
                      : variant === 'success'
                      ? '#16A34A'
                      : variant === 'error'
                      ? '#EF4444'
                      : '#D1D1DB'
                  }
                />
                <div
                  className={cn('w-full h-full flex gap-2', {
                    'items-start flex-col': size === 'big',
                    'items-center': size === 'sm',
                  })}
                >
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription className="flex-1">
                      {description}
                    </ToastDescription>
                  )}
                  {size === 'big' && action}
                </div>
              </div>
              {size !== 'big' && action}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
