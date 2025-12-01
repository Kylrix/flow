'use client';

import React from 'react';
import { Drawer, useTheme, useMediaQuery } from '@mui/material';
import { useLayout } from '@/context/LayoutContext';
import TaskDetails from '@/components/tasks/TaskDetails';
import EventDetails from '@/components/events/EventDetails';

const DRAWER_WIDTH = 420;

export default function RightSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { secondarySidebar, closeSecondarySidebar } = useLayout();
  const { isOpen, type, itemId, data } = secondarySidebar;

  const content = React.useMemo(() => {
    if (!type || !itemId) return null;

    switch (type) {
      case 'task':
        return <TaskDetails taskId={itemId} />;
      case 'event':
        return <EventDetails eventId={itemId} initialData={data} />;
      default:
        return null;
    }
  }, [type, itemId, data]);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeSecondarySidebar}
      variant={isMobile ? 'temporary' : 'persistent'}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : DRAWER_WIDTH,
          borderLeft: `1px solid ${theme.palette.divider}`,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
          background: theme.palette.background.paper,
          zIndex: theme.zIndex.appBar + 1, // Ensure it's above normal content but below modal dialogs if any
        },
      }}
      sx={{
        width: isOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Spacer for AppBar if persistent */}
      {!isMobile && <div style={{ ...theme.mixins.toolbar }} />}
      {content}
    </Drawer>
  );
}

