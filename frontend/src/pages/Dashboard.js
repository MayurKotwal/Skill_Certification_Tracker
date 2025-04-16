import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { Link as RouterLink } from 'react-router-dom';
=======
import { useNavigate, useLocation } from 'react-router-dom';
>>>>>>> Stashed changes
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
<<<<<<< Updated upstream
=======
  Alert,
<<<<<<< Updated upstream
  useTheme,
>>>>>>> Stashed changes
=======
  Paper,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  alpha,
>>>>>>> Stashed changes
} from '@mui/material';
import {
  School as SchoolIcon,
  Code as CodeIcon,
<<<<<<< Updated upstream
  Add as AddIcon,
  BarChart as BarChartIcon,
=======
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Timeline as TimelineIcon,
>>>>>>> Stashed changes
} from '@mui/icons-material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
<<<<<<< Updated upstream
=======
  const theme = useTheme();
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const location = useLocation();
>>>>>>> Stashed changes
=======
  const theme = useTheme();
>>>>>>> Stashed changes
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [skillStats, setSkillStats] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    expert: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
<<<<<<< Updated upstream
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get('/api/users/me', config);
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user data');
=======
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        
        // Show success message if navigated from certification addition
        if (location.state?.message) {
          setSuccessMessage(location.state.message);
          // Clear the message from location state
          window.history.replaceState({}, document.title);
        }
        calculateSkillStats(response.data.skills);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load dashboard data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
>>>>>>> Stashed changes
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
<<<<<<< Updated upstream
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
        borderWidth: 0,
      },
    ],
=======
  }, [navigate, location.state]);

  const calculateSkillStats = (skills) => {
    const stats = skills.reduce((acc, skill) => {
      acc[skill.level.toLowerCase()] = (acc[skill.level.toLowerCase()] || 0) + 1;
      return acc;
    }, {});
    setSkillStats(stats);
>>>>>>> Stashed changes
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
<<<<<<< Updated upstream
      <Container>
<<<<<<< Updated upstream
        <Typography color="error" variant="h6">
          {error}
        </Typography>
=======
        <Alert severity="error" sx={{ mt: 2 }}>
=======
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mt: 4 }}>
>>>>>>> Stashed changes
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
<<<<<<< Updated upstream
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please log in to view your dashboard
=======
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No user data available. Please try logging in again.
>>>>>>> Stashed changes
        </Alert>
>>>>>>> Stashed changes
      </Container>
    );
  }

  const StatCard = ({ title, count, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
        },
        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
        color: 'white',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {count}
            </Typography>
            <Typography variant="subtitle1">{title}</Typography>
          </Box>
          <Box 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track and showcase your skills and certifications
        </Typography>
      </Box>
=======
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: alpha(theme.palette.primary.light, 0.3),
            zIndex: 0,
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: alpha(theme.palette.primary.light, 0.2),
            zIndex: 0,
          }}
        />
        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="subtitle1">
              Track and showcase your skills and certifications
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/profile')}
              startIcon={<PersonIcon />}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.9),
                },
                borderRadius: 2,
                px: 3,
              }}
            >
              View Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
>>>>>>> Stashed changes

      <Grid container spacing={4}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#FF6384', mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Certifications
                  </Typography>
                </Box>
                <IconButton 
                  component={RouterLink} 
                  to="/add-certification" 
                  color="primary"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
<<<<<<< Updated upstream
              <Typography variant="h3" component="div">
                {user?.certifications?.length || 0}
=======
              
              <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                {user.certifications?.length || 0}
>>>>>>> Stashed changes
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Total Certifications
              </Typography>
<<<<<<< Updated upstream
            </CardContent>
          </Card>
=======
    <Container maxWidth="xl">
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mt: 2, mb: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Track and showcase your skills and certifications
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Certifications"
              count={user?.certifications?.length || 0}
              icon={<SchoolIcon sx={{ fontSize: 40, color: 'white' }} />}
              color="#2196f3"
              onClick={() => navigate('/add-certification')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Skills"
              count={user?.skills?.length || 0}
              icon={<CodeIcon sx={{ fontSize: 40, color: 'white' }} />}
              color="#4caf50"
              onClick={() => navigate('/add-skill')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Skill Categories"
              count={new Set(user?.skills?.map(s => s.category)).size || 0}
              icon={<BarChartIcon sx={{ fontSize: 40, color: 'white' }} />}
              color="#ff9800"
              onClick={() => {}}
            />
          </Grid>
>>>>>>> Stashed changes
        </Grid>

        {/* Skill Distribution */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              background: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Skill Level Distribution
                </Typography>
<<<<<<< Updated upstream
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
=======
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                component={RouterLink}
                to="/profile"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'medium',
                  mt: 1
                }}
              >
                View All Certifications
              </Button>
>>>>>>> Stashed changes
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#36A2EB', mr: 2 }}>
                    <CodeIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Skills
                  </Typography>
                </Box>
                <IconButton 
                  component={RouterLink} 
                  to="/add-skill" 
                  color="primary"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                {user.skills?.length || 0}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Total Skills
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                component={RouterLink}
                to="/profile"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'medium',
                  mt: 1
                }}
              >
                View All Skills
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#4BC0C0', mr: 2 }}>
                    <TimelineIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Progress
                  </Typography>
                </Box>
                <IconButton 
                  component={RouterLink} 
                  to="/search-profiles" 
                  color="primary"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <BadgeIcon />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user.publicProfile 
                  ? "Your profile is public and can be shared"
                  : "Make your profile public to share with others"}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                component={RouterLink}
                to="/search-profiles"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 'medium',
                  mt: 1
                }}
              >
                Explore Other Profiles
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              mt: 2, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05), 
                py: 2, 
                px: 3,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Typography variant="h6" fontWeight="medium">
                Skill Level Distribution
              </Typography>
<<<<<<< Updated upstream
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={chartData} />
=======
            </Box>
            <CardContent>
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 2,
                }}
              >
                {user.skills?.length > 0 ? (
                  <Pie data={chartData} options={chartOptions} />
                ) : (
                  <Box textAlign="center" sx={{ p: 4 }}>
                    <CodeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      Add skills to see your skill level distribution
                    </Typography>
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/add-skill"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                    >
                      Add Your First Skill
                    </Button>
                  </Box>
                )}
>>>>>>> Stashed changes
              </Box>
            </CardContent>
          </Card>
=======
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {user?.skills?.length > 0 ? (
                    <Pie
                      data={{
                        labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                        datasets: [{
                          data: [
                            skillStats.beginner || 0,
                            skillStats.intermediate || 0,
                            skillStats.advanced || 0,
                            skillStats.expert || 0
                          ],
                          backgroundColor: [
                            '#ff6b6b',
                            '#4ecdc4',
                            '#45b7d1',
                            '#96ceb4'
                          ],
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          }
                        }
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary">No skills data available</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              background: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Quick Actions
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/add-certification')}
                      sx={{ mb: 2 }}
                    >
                      Add New Certification
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<CodeIcon />}
                      onClick={() => navigate('/add-skill')}
                    >
                      Add New Skill
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
>>>>>>> Stashed changes
        </Grid>
      </Container>
    </Container>
  );
};

export default Dashboard; 