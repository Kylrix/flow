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
  IconButton,
  Chip,
  useTheme,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useNote } from '@/context/NoteContext';

export default function NoteDialog() {
  const theme = useTheme();
  const { noteDialogOpen, setNoteDialogOpen, addNote, updateNote, selectedNoteId, notes } = useNote();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isEditing = Boolean(selectedNoteId);

  useEffect(() => {
    if (isEditing && selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        setTitle(note.title || '');
        setContent(note.content || '');
        setTags(note.tags || []);
      }
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [isEditing, selectedNoteId, notes, noteDialogOpen]);

  const handleClose = () => {
    setNoteDialogOpen(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (isEditing && selectedNoteId) {
      updateNote(selectedNoteId, {
        title,
        content,
        tags,
      });
    } else {
      addNote({
        title,
        content,
        tags,
      });
    }
    handleClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Dialog
      open={noteDialogOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {isEditing ? 'Edit Note' : 'Create Note'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Note title"
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Write your thoughts..."
          />
          
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0.5 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim()}
          sx={{ borderRadius: 2 }}
        >
          {isEditing ? 'Save Changes' : 'Create Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

