'use client';

import React from 'react';
import { ThemeProvider } from '@/theme';
import { TaskProvider, AuthProvider, LayoutProvider } from '@/context';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
