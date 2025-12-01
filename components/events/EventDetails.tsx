'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  Avatar,
  AvatarGroup,
  useTheme,
  alpha,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VideoCall as MeetingIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useLayout } from '@/context/LayoutContext';
import { events as eventApi } from '@/lib/whisperrflow';
import { generateEventPattern } from '@/utils/patternGenerator';
import { Event } from '@/types/whisperrflow';

interface EventDetailsProps {
  eventId: string;
  initialData?: any;
}

export default function EventDetails({ eventId, initialData }: EventDetailsProps) {
  const theme = useTheme();
  const { closeSecondarySidebar } = useLayout();
  const [event, setEvent] = useState<Event | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (initialData) return;
      
      try {
        setLoading(true);
        const data = await eventApi.get(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event details', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
        fetchEvent();
    }
  }, [eventId, initialData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">{error || 'Event not found'}</Typography>
      </Box>
    );
  }

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const coverStyle = event.coverImageId
    ? { backgroundImage: `url(${event.coverImageId})` }
    : { background: generateEventPattern(event.$id + event.title) };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Cover */}
      <Box sx={{ position: 'relative' }}>
        <Box
            sx={{
                height: 140,
                width: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...coverStyle,
            }}
        />
        <IconButton
            onClick={closeSecondarySidebar}
            sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.3)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
        >
            <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, overflow: 'auto', flexGrow: 1 }}>
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip
                    label={event.visibility || 'Public'}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
                {event.status === 'cancelled' && (
                    <Chip label="Cancelled" size="small" color="error" />
                )}
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                {event.title}
            </Typography>
        </Box>

        {/* Date & Time */}
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                When
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <CalendarIcon color="action" fontSize="small" />
                <Typography variant="body2">
                    {format(startDate, 'EEEE, MMMM d, yyyy')}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TimeIcon color="action" fontSize="small" />
                <Typography variant="body2">
                    {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                </Typography>
            </Box>
        </Box>

        {/* Location */}
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Where
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                <Box>
                    <Typography variant="body2" gutterBottom>
                        {event.location || 'Online Event'}
                    </Typography>
                    {event.meetingUrl && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MeetingIcon />}
                            href={event.meetingUrl}
                            target="_blank"
                            sx={{ mt: 1 }}
                        >
                            Join Meeting
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Description */}
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                About
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {event.description || 'No description provided.'}
            </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
                variant="contained"
                fullWidth
                href={`/events/${event.$id}`}
                target="_blank"
            >
                View Event Page
            </Button>
            <Button
                variant="outlined"
                fullWidth
                startIcon={<ShareIcon />}
                onClick={() => {
                     navigator.clipboard.writeText(`${window.location.origin}/events/${event.$id}`);
                }}
            >
                Copy Link
            </Button>
        </Box>
      </Box>
    </Box>
  );
}

