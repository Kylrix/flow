'use client';

import React from 'react';
import { ThemeProvider } from '@/theme';
import { TaskProvider, AuthProvider, LayoutProvider, OriginProvider, NotificationProvider } from '@/context';
import { useEcosystemIntents } from '@/hooks/useEcosystemIntents';
import { useEcosystemNode } from '@/hooks/useEcosystemNode';

interface AppProvidersProps {
  children: React.ReactNode;
}

function EcosystemHandler() {
  useEcosystemIntents();
  useEcosystemNode('flow');
  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LayoutProvider>
            <OriginProvider>
              <TaskProvider>
                <EcosystemHandler />
                {children}
              </TaskProvider>
            </OriginProvider>
          </LayoutProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
