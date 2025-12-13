import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conditional classes', () => {
    expect(cn('px-2', { 'py-1': true, 'bg-red-500': false })).toBe('px-2 py-1');
  });

  it('should merge Tailwind classes correctly (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle arrays', () => {
    expect(cn(['px-2', 'py-1'], 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });
});
