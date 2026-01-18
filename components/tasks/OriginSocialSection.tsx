'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Chip, Avatar, Paper, alpha, useTheme } from '@mui/material';
import { useOriginSocial } from '@/hooks/useOriginSocial';

interface OriginSocialSectionProps {
  taskTitle: string;
}

export default function OriginSocialSection({ taskTitle }: OriginSocialSectionProps) {
  const theme = useTheme();
  
  // Safely access origin social - hooks must be called at top level
  // If the provider isn't ready, this might still throw if not careful
  // But with isClient check in OriginProvider it should be fine.
  const origin = useOriginSocial();
  const { isAuthenticated, socialContext, fetchSocialContext } = origin || {};
  
  useEffect(() => {
    if (isAuthenticated && taskTitle && fetchSocialContext) {
      const match = taskTitle.match(/@(\w+)/);
      if (match) {
        fetchSocialContext(match[1]);
      }
    }
  }, [isAuthenticated, taskTitle, fetchSocialContext]);

  if (!socialContext) return null;

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        Social Context <Chip label="Origin" size="small" color="primary" sx={{ height: 20, fontSize: '0.6rem' }} />
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar src={socialContext.user?.profileImage} alt={socialContext.user?.name} />
        <Box>
            <Typography variant="body2" fontWeight={600}>{socialContext.user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">@{socialContext.user?.username}</Typography>
        </Box>
        </Box>
        {socialContext.tweets?.map((tweet: any) => (
            <Paper key={tweet.id} sx={{ p: 1.5, mb: 1, bgcolor: 'background.paper' }} elevation={0} variant="outlined">
                <Typography variant="body2" fontSize="0.85rem">{tweet.text}</Typography>
            </Paper>
        ))}
    </Box>
  );
}

