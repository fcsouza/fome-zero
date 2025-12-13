import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utility wrapper for consistent usage across the app
 * Provides type-safe helper functions for common toast patterns
 */

/**
 * Display a success toast notification
 */
export function toastSuccess(message: string, description?: string) {
  return sonnerToast.success(message, {
    description,
    duration: 4000,
  });
}

/**
 * Display an error toast notification
 */
export function toastError(message: string, description?: string) {
  return sonnerToast.error(message, {
    description,
    duration: 5000,
  });
}

/**
 * Display an info toast notification
 */
export function toastInfo(message: string, description?: string) {
  return sonnerToast.info(message, {
    description,
    duration: 4000,
  });
}

/**
 * Display a loading toast notification
 */
export function toastLoading(message: string) {
  return sonnerToast.loading(message);
}

/**
 * Dismiss a toast by its ID
 */
export function toastDismiss(toastId: string | number) {
  return sonnerToast.dismiss(toastId);
}

/**
 * Handle a promise with automatic loading/success/error states
 */
export function toastPromise<T>(
  promise: Promise<T> | (() => Promise<T>),
  options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
    description?: string | ((data: T) => string);
  }
) {
  return sonnerToast.promise(promise, {
    loading: options.loading,
    success: (data) => {
      const message =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success;
      let description: string | undefined;
      if (options.description) {
        description =
          typeof options.description === 'function'
            ? options.description(data)
            : options.description;
      }
      return {
        message,
        description,
      };
    },
    error: (error) =>
      typeof options.error === 'function'
        ? options.error(error)
        : options.error,
  });
}
