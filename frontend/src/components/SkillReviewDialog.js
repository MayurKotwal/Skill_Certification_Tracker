import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const SkillReviewDialog = ({
  open,
  onClose,
  extractedSkills,
  onConfirm,
  suggestedSkills,
  authenticity,
  title,
}) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'beginner',
    category: 'Programming Languages',
  });
  const [error, setError] = useState('');

  // Initialize skills when dialog opens or extractedSkills change
  useEffect(() => {
    if (open && extractedSkills) {
      const initialSkills = extractedSkills.map(skill => ({
        name: skill.name || '',
        level: skill.level || 'beginner',
        category: skill.category || 'Programming Languages',
        confidence: skill.confidence || 1.0,
        isEditing: false
      }));
      
      // Add Python skill by default if no skills and title includes python
      if (initialSkills.length === 0 && title?.toLowerCase().includes('python')) {
        initialSkills.push({
          name: 'Python',
          level: 'beginner',
          category: 'Programming Languages',
          confidence: 1.0,
          isEditing: false
        });
      }
      
      console.log('Initializing skills:', initialSkills);
      setSkills(initialSkills);
      setError('');
    }
  }, [open, extractedSkills, title]);

  const skillCategories = [
    'Programming Languages',
    'Web Development',
    'Databases',
    'Cloud Computing',
    'Networking',
    'Security',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Other'
  ];

  const handleSkillEdit = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setSkills(updatedSkills);
    setError('');
  };

  const handleSkillDelete = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    setError('');
  };

  const handleAddNewSkill = () => {
    if (!newSkill.name.trim()) {
      setError('Skill name cannot be empty');
      return;
    }

    // Check for duplicate skill names
    const isDuplicate = skills.some(
      skill => skill.name.toLowerCase().trim() === newSkill.name.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError('This skill has already been added');
      return;
    }

    const skillToAdd = {
      ...newSkill,
      name: newSkill.name.trim(),
      category: newSkill.category || 'Programming Languages',
      confidence: 1.0,
      isEditing: false
    };

    setSkills([...skills, skillToAdd]);
    setNewSkill({
      name: '',
      level: 'beginner',
      category: 'Programming Languages',
    });
    setError('');
  };

  const handleConfirm = () => {
    // Validate that we have at least one skill
    if (skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    // Validate all skills have names
    const emptySkills = skills.filter(skill => !skill.name.trim());
    if (emptySkills.length > 0) {
      setError('All skills must have names');
      return;
    }

    // Format skills to match the backend's expected structure
    const formattedSkills = skills
      .map(skill => ({
        name: skill.name.trim().toLowerCase(),
        level: skill.level || 'beginner',
        category: skill.category || 'Programming Languages',
        confidence: skill.confidence || 1.0
      }))
      .filter((skill, index, self) => 
        // Remove duplicates based on name
        index === self.findIndex(s => s.name === skill.name)
      );

    console.log('Formatted skills before sending:', formattedSkills);
    
    // Ensure we have at least one skill
    if (formattedSkills.length === 0) {
      if (title?.toLowerCase().includes('python')) {
        formattedSkills.push({
          name: 'python',
          level: 'beginner',
          category: 'Programming Languages',
          confidence: 1.0
        });
      } else {
        setError('Please add at least one skill');
        return;
      }
    }

    console.log('Final skills being sent:', formattedSkills);
    onConfirm(formattedSkills);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Skills to Your Certification</DialogTitle>
      <DialogContent>
        {authenticity && (
          <Box sx={{ mb: 2 }}>
            <Alert 
<<<<<<< Updated upstream
              severity="info"
=======
              severity={authenticity.authenticity_score > 0.05 ? "success" : "warning"}
>>>>>>> Stashed changes
              sx={{ mb: 1 }}
            >
<<<<<<< Updated upstream
              Certificate Analysis Results
              {authenticity.flags?.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Note: Some information couldn't be automatically verified. You can still proceed with adding your certification.
                </Typography>
              )}
=======
              Certificate Authenticity Score: {(authenticity.authenticity_score * 100).toFixed(1)}%
              <Typography variant="caption" component="div">
                Note: Low scores won't prevent you from adding your certification. You can continue without uploading a certificate file.
              </Typography>
>>>>>>> Stashed changes
            </Alert>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom>
          The following skills were extracted from your certificate. You can edit, delete, or add new skills before confirming.
        </Typography>

        <List>
          {skills.map((skill, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleSkillDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={skill.name}
                      onChange={(e) => handleSkillEdit(index, 'name', e.target.value)}
                      variant="standard"
                      sx={{ flexGrow: 1 }}
                      error={!skill.name.trim()}
                      helperText={!skill.name.trim() ? 'Skill name is required' : ''}
                    />
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <Select
                        value={skill.level}
                        onChange={(e) => handleSkillEdit(index, 'level', e.target.value)}
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ minWidth: 150 }}>
                      <Select
                        value={skill.category}
                        onChange={(e) => handleSkillEdit(index, 'category', e.target.value)}
                      >
                        {skillCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add New Skill
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              variant="outlined"
              size="small"
              placeholder="Enter skill name"
              sx={{ flexGrow: 1 }}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <Select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              >
                {skillCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddNewSkill}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>

        {suggestedSkills && suggestedSkills.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Suggested Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  onClick={() => {
                    const isDuplicate = skills.some(
                      s => s.name.toLowerCase().trim() === skill.name.toLowerCase().trim()
                    );
                    if (!isDuplicate) {
                      setNewSkill({
                        name: skill.name,
                        level: skill.level || 'beginner',
                        category: skill.category || 'Programming Languages'
                      });
                    } else {
                      setError('This skill has already been added');
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm Skills
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SkillReviewDialog; 