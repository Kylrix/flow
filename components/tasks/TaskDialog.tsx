'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  IconButton,
  Typography,
  Divider,
  useTheme,
  alpha,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  X,
  Flag,
  Calendar,
  Folder,
  Tag as TagIcon,
  Paperclip,
  Trash2,
  User,
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTask } from '@/context/TaskContext';
import { Priority, TaskStatus } from '@/types';
import { taskAttachments } from '@/lib/storage';
import { tablesDB } from '@/lib/appwrite';

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#94a3b8' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

export default function TaskDialog() {
  const theme = useTheme();
  const {
    taskDialogOpen,
    setTaskDialogOpen,
    addTask,
    projects,
    labels,
    selectedProjectId,
    userId,
  } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState(selectedProjectId || 'inbox');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<{ id: string, name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contacts, setContacts] = useState<{ id: string, name: string }[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  // Bridge: Load contacts from Connect
  useEffect(() => {
    if (taskDialogOpen && userId) {
      tablesDB.listRows({
        databaseId: 'chat',
        tableId: 'contacts',
        queries: []
      }).then((res: any) => {
        // Map contacts to simple {id, name}
        const mapped = (res.rows || res.documents).map((c: any) => ({
          id: c.contactUserId,
          name: c.nickname || 'Unknown Contact'
        }));
        setContacts(mapped);
      }).catch(() => {});
    }
  }, [taskDialogOpen, userId]);

  const handleClose = () => {
    setTaskDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setProjectId(selectedProjectId || 'inbox');
    setSelectedLabels([]);
    setDueDate(null);
    setEstimatedTime('');
    setPendingAttachments([]);
    setIsUploading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await taskAttachments.upload(file);
        return { id: result.$id, name: file.name };
      });

      const newAttachments = await Promise.all(uploadPromises);
      setPendingAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error('Failed to upload attachments:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = async (id: string) => {
    try {
      await taskAttachments.delete(id);
      setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      projectId,
      labels: selectedLabels,
      dueDate: dueDate || undefined,
      estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : undefined,
      subtasks: [],
      comments: [],
      attachments: pendingAttachments.map(a => ({
        id: a.id,
        name: a.name,
        url: '', // Will be hydrated by service/maper if needed
        type: 'file',
        size: 0,
        uploadedAt: new Date()
      })),
      reminders: [],
      timeEntries: [],
      assigneeIds: selectedAssignees,
      creatorId: userId || 'guest',
      isArchived: false,
    });

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={taskDialogOpen}
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
                NEW TASK
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Initialize execution track
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'rgba(255, 255, 255, 0.4)', '&:hover': { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
            <X size={18} strokeWidth={1.5} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box
            component="form"
            onKeyDown={handleKeyDown}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}
          >
            {/* Title */}
            <TextField
              autoFocus
              placeholder="What's the primary objective?"
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
              placeholder="Detailed parameters and context..."
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
                {/* Project & Priority Row */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Project */}
                <FormControl variant="filled" fullWidth size="small" hiddenLabel>
                    <InputLabel sx={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase' }}>Project</InputLabel>
                    <Select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disableUnderline
                    sx={{ borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    renderValue={(selected) => {
                        const project = projects.find(p => p.id === selected);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: project?.color }} />
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{project?.name}</Typography>
                            </Box>
                        );
                    }}
                    >
                    {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id} sx={{ py: 1.5, gap: 1.5 }}>
                            <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: project.color,
                            }}
                            />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{project.name}</Typography>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Priority */}
                <FormControl variant="filled" fullWidth size="small" hiddenLabel>
                    <InputLabel sx={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase' }}>Priority</InputLabel>
                    <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    disableUnderline
                    sx={{ borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Flag size={14} color={priorityOptions.find(p => p.value === selected)?.color} strokeWidth={2} />
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{priorityOptions.find(p => p.value === selected)?.label.toUpperCase()}</Typography>
                        </Box>
                    )}
                    >
                    {priorityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ py: 1.5, gap: 1.5 }}>
                            <Flag size={16} color={option.color} strokeWidth={2} />
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{option.label}</Typography>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>

                {/* Due Date & Status Row */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Due Date */}
                <DatePicker
                    label="DEADLINE"
                    value={dueDate}
                    onChange={(newValue) => setDueDate(newValue)}
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

                {/* Status */}
                <FormControl variant="filled" fullWidth size="small" hiddenLabel>
                    <InputLabel sx={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase' }}>Status</InputLabel>
                    <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    disableUnderline
                    sx={{ borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    renderValue={(selected) => (
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                            {statusOptions.find(s => s.value === selected)?.label.toUpperCase()}
                        </Typography>
                    )}
                    >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ py: 1.5 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{option.label}</Typography>
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
            </Box>

            {/* Attachments Section */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Attachments
                    </Typography>
                    <Button
                        component="label"
                        size="small"
                        startIcon={<Paperclip size={14} strokeWidth={2} />}
                        sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#00F5FF', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(0, 245, 255, 0.05)' } }}
                    >
                        ADD
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                
                {isUploading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CircularProgress size={12} sx={{ color: '#00F5FF' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>Syncing files...</Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {pendingAttachments.map((file) => (
                        <Chip
                            key={file.id}
                            label={file.name}
                            size="small"
                            onDelete={() => handleRemoveAttachment(file.id)}
                            deleteIcon={<X size={12} strokeWidth={2.5} />}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                color: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                '& .MuiChip-deleteIcon': { color: 'rgba(255, 255, 255, 0.3)', '&:hover': { color: '#ef4444' } }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Assignees Section */}
            <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 800, letterSpacing: '0.05em', mb: 1.5, textTransform: 'uppercase' }}>
                    Assignees
                </Typography>
                <Autocomplete
                    multiple
                    options={contacts}
                    getOptionLabel={(option) => option.name}
                    value={contacts.filter(c => selectedAssignees.includes(c.id))}
                    onChange={(_, newValue) => setSelectedAssignees(newValue.map(v => v.id))}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            padding: '4px 8px',
                            bgcolor: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            '&:hover': { border: '1px solid rgba(255, 255, 255, 0.1)' },
                            '&.Mui-focused': { border: '1px solid rgba(0, 245, 255, 0.3)' }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            placeholder={contacts.length > 0 ? "Search contacts..." : "No ecosystem contacts"}
                            InputProps={{ ...params.InputProps, disableUnderline: true, sx: { fontSize: '0.85rem' } }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                {...getTagProps({ index })}
                                key={option.id}
                                label={option.name}
                                size="small"
                                icon={<User size={12} strokeWidth={2} style={{ color: 'inherit' }} />}
                                sx={{
                                    bgcolor: 'rgba(0, 245, 255, 0.1)',
                                    color: '#00F5FF',
                                    fontWeight: 700,
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                }}
                            />
                        ))
                    }
                />
            </Box>

            {/* Labels */}
            <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 800, letterSpacing: '0.05em', mb: 1.5, textTransform: 'uppercase' }}>
                    Tags
                </Typography>
                <Autocomplete
                    multiple
                    options={labels}
                    value={labels.filter((l) => selectedLabels.includes(l.id))}
                    onChange={(_, newValue) => setSelectedLabels(newValue.map((l) => l.id))}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        variant="standard"
                        placeholder="Categorize..."
                        InputProps={{ ...params.InputProps, disableUnderline: true, sx: { fontSize: '0.85rem' } }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                        <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name.toUpperCase()}
                            size="small"
                            sx={{
                            backgroundColor: alpha(option.color, 0.1),
                            color: option.color,
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            border: `1px solid ${alpha(option.color, 0.2)}`,
                            }}
                        />
                        ))
                    }
                    renderOption={(props, option) => (
                        <Box
                        component="li"
                        {...props}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}
                        >
                        <Box sx={{ width: 4, height: 16, borderRadius: 1, bgcolor: option.color }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{option.name}</Typography>
                        </Box>
                    )}
                />
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
            disabled={!title.trim()}
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
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
