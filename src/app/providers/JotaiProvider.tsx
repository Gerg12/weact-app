'use client';

import { Provider } from 'jotai';
import { ReactNode } from 'react';

/**
 * JotaiProvider Component
 * 
 * Wraps the application with Jotai's Provider for state management.
 * This enables:
 * - Global state sharing across components
 * - Fine-grained reactivity (only re-render what changes)
 * - Atomic state management
 * 
 * Usage: Wrap your app in layout.tsx
 */

interface JotaiProviderProps {
  children: ReactNode;
}

export default function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}

