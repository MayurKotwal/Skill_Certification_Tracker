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
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('File must be an image or PDF and less than 5MB');
        return;
      }
      setFile(acceptedFiles[0]);
      setError('');
    },
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

      if (response.data) {
        setSuccess('Certification added successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading certification');
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
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
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
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Add Certification'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AddCertification; 