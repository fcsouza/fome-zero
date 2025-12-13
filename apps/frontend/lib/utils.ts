import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal className handling
 *
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': isActive })
 * cn('px-2', 'px-4') // Returns 'px-4' (last one wins)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
