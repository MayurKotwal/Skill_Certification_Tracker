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
} from '@mui/material';
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import api from '../utils/axiosConfig';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publicProfile, setPublicProfile] = useState(false);

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
    <Container>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={user.profileImage}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h5" component="h1" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
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
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                {user.skills && user.skills.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.skills.map((skill) => (
                      <Grid item xs={12} sm={6} key={skill._id}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1">{skill.name}</Typography>
                            <Typography color="text.secondary">
                              Level: {skill.level}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">
                    No skills added yet
                  </Typography>
                )}
                <Button
                  variant="contained"
                  startIcon={<CodeIcon />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/add-skill')}
                >
                  Add Skill
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Certifications
                </Typography>
                {user.certifications && user.certifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {user.certifications.map((cert) => (
                      <Grid item xs={12} sm={6} key={cert._id}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1">{cert.title}</Typography>
                            <Typography color="text.secondary">
                              Issuer: {cert.issuer}
                            </Typography>
                            <Typography color="text.secondary">
                              Issue Date: {new Date(cert.issueDate).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">
                    No certifications added yet
                  </Typography>
                )}
                <Button
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/add-certification')}
                >
                  Add Certification
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 