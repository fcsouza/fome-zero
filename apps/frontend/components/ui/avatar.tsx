import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_SIZE = 100;

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<
  HTMLImageElement,
  ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  // biome-ignore lint: Avatar component requires native img for ref forwarding and external URL support
  <img
    alt={props.alt || 'Avatar image'}
    className={cn('aspect-square h-full w-full', className)}
    height={props.height || DEFAULT_SIZE}
    ref={ref}
    width={props.width || DEFAULT_SIZE}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    ref={ref}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
