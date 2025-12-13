import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const loadingVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function Loading({
  size,
  className,
  text,
  fullScreen = false,
}: LoadingProps) {
  const spinner = (
    <Loader2 className={cn(loadingVariants({ size }), className)} />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        {spinner}
        {text && <p className="mt-4 text-muted-foreground text-sm">{text}</p>}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {spinner}
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    );
  }

  return spinner;
}
