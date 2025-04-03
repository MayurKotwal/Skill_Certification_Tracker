import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get('/api/users/me', config);
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const skillLevels = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    expert: 0,
  };

  if (user?.skills) {
    user.skills.forEach((skill) => {
      skillLevels[skill.level]++;
    });
  }

  const chartData = {
    labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    datasets: [
      {
        data: [
          skillLevels.beginner,
          skillLevels.intermediate,
          skillLevels.advanced,
          skillLevels.expert,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
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
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track and showcase your skills and certifications
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  <SchoolIcon sx={{ mr: 1 }} />
                  Certifications
                </Typography>
                <Button
                  component={RouterLink}
                  to="/add-certification"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Typography variant="h3" component="div">
                {user?.certifications?.length || 0}
              </Typography>
              <Typography color="text.secondary">
                Total Certifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  <CodeIcon sx={{ mr: 1 }} />
                  Skills
                </Typography>
                <Button
                  component={RouterLink}
                  to="/add-skill"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Typography variant="h3" component="div">
                {user?.skills?.length || 0}
              </Typography>
              <Typography color="text.secondary">
                Total Skills
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Level Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={chartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 