import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
<<<<<<< Updated upstream
  IconButton,
=======
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
>>>>>>> Stashed changes
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Code as CodeIcon,
<<<<<<< Updated upstream
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
=======
  Visibility as ViewIcon,
>>>>>>> Stashed changes
} from '@mui/icons-material';
import api from '../utils/axiosConfig';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publicProfile, setPublicProfile] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
        setPublicProfile(res.data.publicProfile);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePublicProfileChange = async () => {
    try {
      await api.put('/users/profile', { publicProfile: !publicProfile });
      setPublicProfile(!publicProfile);
    } catch (err) {
      setError('Failed to update profile visibility');
    }
  };

<<<<<<< Updated upstream
  const handleViewCertificate = (certificateFile) => {
    if (certificateFile) {
      const certificateUrl = `http://localhost:3001/uploads/${certificateFile}`;
      console.log('Opening certificate:', certificateUrl);
      window.open(certificateUrl, '_blank');
    }
  };

  const handleDeleteCertificate = async (certId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/certifications/${certId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh user data after deletion
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setError('Failed to delete certificate');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/skills/${skillId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh user data after deletion
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill');
    }
=======
  const handleViewCert = (cert) => {
    setSelectedCert(cert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCert(null);
>>>>>>> Stashed changes
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={user.profileImage}
                    alt={user.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid white',
                      boxShadow: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {user.email}
                  </Typography>
<<<<<<< Updated upstream
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/profile/edit')}
                  >
                    Edit Profile
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={publicProfile}
                        onChange={handlePublicProfileChange}
                      />
                    }
                    label="Public Profile"
                    sx={{ mt: 2 }}
                  />
                </Box>
              </CardContent>
=======
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/edit-profile')}
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/add-certification')}
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                      }}
                    >
                      Add Certification
                    </Button>
                  </Box>
                </Grid>
              </Grid>
>>>>>>> Stashed changes
            </Card>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Skills
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<CodeIcon />}
                    onClick={() => navigate('/add-skill')}
                    size="small"
                  >
                    Add Skill
                  </Button>
                </Box>
                {user.skills && user.skills.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.skills.map((skill) => (
                      <Grid item xs={12} sm={6} key={skill._id}>
                        <Card sx={{ 
                          borderRadius: 1,
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {skill.name}
                              </Typography>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteSkill(skill._id)}
                                size="small"
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: 'error.light',
                                    color: 'white'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Level: {skill.level}
                            </Typography>
<<<<<<< Updated upstream
=======
                            {skill.category && (
                              <Typography variant="body2" color="text.secondary">
                                Category: {skill.category}
                              </Typography>
                            )}
>>>>>>> Stashed changes
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    bgcolor: 'grey.50',
                    borderRadius: 1
                  }}>
                    <CodeIcon sx={{ fontSize: 40, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary">
                      No skills added yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Certifications Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Certifications
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate('/add-certification')}
                    size="small"
                  >
                    Add Certification
                  </Button>
                </Box>
                {user.certifications && user.certifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.certifications.map((cert) => (
                      <Grid item xs={12} sm={6} key={cert._id}>
                        <Card sx={{ 
                          borderRadius: 1,
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {cert.title}
                              </Typography>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteCertificate(cert._id)}
                                size="small"
                                sx={{ 
                                  '&:hover': { 
                                    bgcolor: 'error.light',
                                    color: 'white'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Issuer: {cert.issuer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Issue Date: {new Date(cert.issueDate).toLocaleDateString()}
                            </Typography>
<<<<<<< Updated upstream
=======
                            {cert.credentialId && (
                              <Typography variant="body2" color="text.secondary">
                                Credential ID: {cert.credentialId}
                              </Typography>
                            )}
<<<<<<< Updated upstream
                            {cert.certificateFile && (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleViewCertificate(cert.certificateFile)}
                                startIcon={<VisibilityIcon />}
                                sx={{ mt: 2, width: '100%' }}
                              >
                                View Certificate
                              </Button>
                            )}
>>>>>>> Stashed changes
=======
                            <Button
                              variant="outlined"
                              startIcon={<ViewIcon />}
                              onClick={() => handleViewCert(cert)}
                              sx={{ mt: 1 }}
                            >
                              View Details
                            </Button>
>>>>>>> Stashed changes
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    bgcolor: 'grey.50',
                    borderRadius: 1
                  }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary">
                      No certifications added yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Certificate Details</DialogTitle>
        <DialogContent>
          {selectedCert && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCert.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Issuer:</strong> {selectedCert.issuer}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Issue Date:</strong> {new Date(selectedCert.issueDate).toLocaleDateString()}
              </Typography>
              {selectedCert.credentialId && (
                <Typography variant="body1" gutterBottom>
                  <strong>Credential ID:</strong> {selectedCert.credentialId}
                </Typography>
              )}
              {selectedCert.credentialUrl && (
                <Typography variant="body1" gutterBottom>
                  <strong>Credential URL:</strong> {selectedCert.credentialUrl}
                </Typography>
              )}
              {selectedCert.description && (
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong> {selectedCert.description}
                </Typography>
              )}
              {selectedCert.certificateFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Certificate File:</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    component="a"
                    href={`http://localhost:3001/api/certifications/file/${selectedCert.certificateFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Certificate
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 