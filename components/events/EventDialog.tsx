'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  useTheme,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  X,
  MapPin,
  Link as LinkIcon,
  Image as ImageIcon,
  Globe,
  Lock,
  EyeOff,
} from 'lucide-react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addHours } from 'date-fns';
import { EventVisibility } from '@/lib/permissions';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
}

export default function EventDialog({ open, onClose, onSubmit }: EventDialogProps) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(addHours(new Date(), 1));
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [visibility, setVisibility] = useState<EventVisibility>('public');

  const handleSubmit = () => {
    if (!title.trim() || !startTime || !endTime) return;

    onSubmit({
      title,
      description,
      startTime,
      endTime,
      location,
      url,
      coverImage,
      visibility,
    });

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime(new Date());
    setEndTime(addHours(new Date(), 1));
    setLocation('');
    setUrl('');
    setCoverImage('');
    setVisibility('public');
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundImage: 'none',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 3,
            pb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'white', fontFamily: 'var(--font-space-grotesk)' }}>
                NEW EVENT
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Broadcast through ecosystem
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'rgba(255, 255, 255, 0.4)', '&:hover': { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
            <X size={18} strokeWidth={1.5} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {/* Title */}
            <TextField
              autoFocus
              placeholder="What's the occasion?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { 
                    fontSize: '1.25rem', 
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: 'white',
                    fontFamily: 'var(--font-space-grotesk)',
                    padding: 0,
                    '&::placeholder': {
                        opacity: 0.2,
                    }
                },
              }}
            />

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* Description */}
            <TextField
              placeholder="Tell us more about it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { 
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-inter)',
                },
              }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: 2.5, borderRadius: '16px', bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {/* Date Time Row */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                <DateTimePicker
                    label="START TIME"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: 'filled',
                            size: 'small',
                            InputProps: { disableUnderline: true, sx: { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' } },
                            InputLabelProps: { sx: { fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.3)' } }
                        },
                    }}
                />
                <DateTimePicker
                    label="END TIME"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: 'filled',
                            size: 'small',
                            InputProps: { disableUnderline: true, sx: { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' } },
                            InputLabelProps: { sx: { fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.3)' } }
                        },
                    }}
                />
                </Box>

                {/* Location */}
                <TextField
                placeholder="Add location or meeting link"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                variant="filled"
                size="small"
                InputProps={{
                    disableUnderline: true,
                    sx: { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' },
                    startAdornment: (
                    <InputAdornment position="start">
                        <MapPin size={16} strokeWidth={2} color={theme.palette.primary.main} />
                    </InputAdornment>
                    ),
                }}
                />

                {/* URL */}
                <TextField
                placeholder="Event link (https://...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                variant="filled"
                size="small"
                InputProps={{
                    disableUnderline: true,
                    sx: { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' },
                    startAdornment: (
                    <InputAdornment position="start">
                        <LinkIcon size={16} strokeWidth={2} color={theme.palette.secondary.main} />
                    </InputAdornment>
                    ),
                }}
                />

                {/* Cover Image URL */}
                <TextField
                placeholder="Cover image URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                fullWidth
                variant="filled"
                size="small"
                InputProps={{
                    disableUnderline: true,
                    sx: { borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' },
                    startAdornment: (
                    <InputAdornment position="start">
                        <ImageIcon size={16} strokeWidth={2} color="rgba(255, 255, 255, 0.4)" />
                    </InputAdornment>
                    ),
                }}
                />
            </Box>

            {/* Visibility */}
            <Box>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1.5 }}>
                Event Visibility
              </Typography>
              <ToggleButtonGroup
                value={visibility}
                exclusive
                onChange={(_, value) => value && setVisibility(value)}
                fullWidth
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  p: 0.5,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '8px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'none',
                    fontWeight: 700,
                    flex: 1,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#00F5FF',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#00D1DA',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="public">
                  <Tooltip title="Anyone can discover and view this event">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Globe size={16} strokeWidth={2} />
                      <Typography variant="body2" fontWeight={700}>Public</Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="unlisted">
                  <Tooltip title="Only people with the link can view">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EyeOff size={16} strokeWidth={2} />
                      <Typography variant="body2" fontWeight={700}>Unlisted</Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="private">
                  <Tooltip title="Only you can view this event">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lock size={16} strokeWidth={2} />
                      <Typography variant="body2" fontWeight={700}>Private</Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 3, gap: 1.5, bgcolor: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
                color: 'rgba(255, 255, 255, 0.4)',
                fontWeight: 800,
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                '&:hover': { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            Cancel Request
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim() || !startTime || !endTime}
            sx={{
                px: 3,
                py: 1,
                borderRadius: '12px',
                fontWeight: 900,
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
                bgcolor: '#00F5FF',
                color: 'black',
                textTransform: 'uppercase',
                boxShadow: '0 8px 20px rgba(0, 245, 255, 0.2)',
                '&:hover': {
                    bgcolor: '#00D1DA',
                    boxShadow: '0 12px 28px rgba(0, 245, 255, 0.3)',
                },
                '&.Mui-disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            }}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
