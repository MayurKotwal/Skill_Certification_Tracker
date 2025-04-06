import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const AddCertification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles[0].errors.map(err => {
          if (err.code === 'file-too-large') return 'File is larger than 5MB';
          if (err.code === 'file-invalid-type') return 'File must be an image (JPEG, PNG) or PDF';
          return err.message;
        });
        setError(errors.join('. '));
        return;
      }
      setFile(acceptedFiles[0]);
      setError('');
    },
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

<<<<<<< Updated upstream
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setError('Only images and PDF files are allowed');
        return;
      }
      
      setFile(file);
      setError('');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.issuer || !formData.issueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add file if exists
      if (file) {
        formDataToSend.append('certificateFile', file);
      }

      // Get token from localStorage
=======
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
>>>>>>> Stashed changes
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to add a certification');
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3001/api/certifications', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

<<<<<<< Updated upstream
      if (response.data) {
        setSuccess('Certification added successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading certification');
=======
      // Send for analysis first
      const analysisResponse = await axios.post(
        'http://localhost:3001/api/certifications/analyze',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Analysis response:', analysisResponse.data);

      if (analysisResponse.data.extractedSkills) {
        setExtractedSkills(analysisResponse.data.extractedSkills);
      }
      if (analysisResponse.data.analysis?.suggested_skills) {
        setSuggestedSkills(analysisResponse.data.analysis.suggested_skills);
      }
      if (analysisResponse.data.authenticity) {
        setAuthenticity(analysisResponse.data.authenticity);
      }

      // Show skill review dialog
      setShowSkillReview(true);
    } catch (err) {
      console.error('Error during file upload or analysis:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error uploading or analyzing certificate';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillConfirm = async (confirmedSkills) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to add a certification');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.issuer || !formData.issueDate) {
        setError('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add file if exists
      if (file) {
        formDataToSend.append('certificateFile', file);
      }

      // Add confirmed skills - ensure they're properly formatted
      if (confirmedSkills && confirmedSkills.length > 0) {
        // Format skills to match backend expectations
        const formattedSkills = confirmedSkills.map(skill => ({
          name: skill.name.trim().toLowerCase(),
          level: skill.level || 'beginner',
          category: skill.category || 'Programming Languages',
          confidence: skill.confidence || 1.0
        }));
        
        console.log('Sending confirmed skills:', formattedSkills);
        // Important: Send as a string with proper content type
        formDataToSend.append('confirmedSkills', JSON.stringify(formattedSkills));
      } else {
        console.log('No skills to send');
        formDataToSend.append('confirmedSkills', JSON.stringify([]));
      }

      console.log('Sending certification data to server...');
      const response = await axios.post(
        'http://localhost:3001/api/certifications',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Server response:', response.data);

      // Verify the certification was created
      if (!response.data.certification || !response.data.certification._id) {
        throw new Error('No certification data received from server');
      }

      // Set success message based on skills added
      const skillsAdded = response.data.certification.skills?.length || 0;
      const successMessage = skillsAdded > 0
        ? `Certification added successfully with ${skillsAdded} skills!`
        : 'Certification added successfully!';
      
      setSuccess(successMessage);
      
      // Force refresh user data
      console.log('Refreshing user data...');
      await axios.get('http://localhost:3001/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Navigate to dashboard with refresh state and message
      navigate('/dashboard', { 
        state: { 
          refreshSkills: true,
          message: successMessage
        },
        replace: true
      });
    } catch (err) {
      console.error('Error adding certification:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error adding certification and skills';
      setError(errorMessage);
      
      // Log detailed error information
      console.error('Detailed error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Certification
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Certification Title"
                name="title"
                value={formData.title}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Issuing Organization"
                name="issuer"
                value={formData.issuer}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Issue Date"
                name="issueDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.expiryDate}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credential ID"
                name="credentialId"
                value={formData.credentialId}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credential URL"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: error ? 'error.main' : 'primary.main',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
<<<<<<< Updated upstream
                <input {...getInputProps()} />
                {file ? (
                  <Typography>
                    Selected file: {file.name}
                  </Typography>
                ) : (
                  <Typography>
                    Drag and drop a file here, or click to select a file
                  </Typography>
                )}
=======
                <input {...getInputProps()} disabled={loading} />
                <Box sx={{ mb: 2 }}>
                  {file ? (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Selected file: {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {(file.size / 1024 / 1024).toFixed(2)}MB
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Drag and drop your certificate file here, or click to select
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accepted formats: PDF, JPEG, PNG (Max size: 5MB)
                      </Typography>
                    </>
                  )}
                </Box>
>>>>>>> Stashed changes
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !file}
                sx={{ mt: 2 }}
              >
<<<<<<< Updated upstream
                {loading ? 'Uploading...' : 'Add Certification'}
=======
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  'Add Certification'
                )}
>>>>>>> Stashed changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AddCertification; 