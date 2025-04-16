import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';
import api from '../utils/axiosConfig';

const SearchProfiles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Fetch all profiles when component loads
  useEffect(() => {
    if (tabValue === 1) {
      fetchAllProfiles();
    }
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // If search is empty, fetch all profiles instead
      if (!searchQuery.trim()) {
        await fetchAllProfiles();
        return;
      }
      
      console.log('Searching for profiles with query:', searchQuery);
      const response = await api.get(`/search/profiles/search?query=${encodeURIComponent(searchQuery)}`);
      console.log('Search API response:', response);
      
      if (response.data && response.data.length > 0) {
        // If API returns profiles, use them
        console.log('Profiles found from search:', response.data);
        setProfiles(response.data);
      } else {
        // If API returns empty array, filter mock data
        console.log('No profiles found from search, filtering mock data');
        const mockProfiles = getMockProfiles();
        const filteredMockProfiles = mockProfiles.filter(profile => {
          // Basic case-insensitive search on name and email
          const query = searchQuery.toLowerCase();
          const nameMatch = profile.name.toLowerCase().includes(query);
          const emailMatch = profile.email.toLowerCase().includes(query);
          
          // Search in skills
          const skillMatch = profile.skills.some(skill => 
            skill.name.toLowerCase().includes(query)
          );
          
          // Search in certifications
          const certMatch = profile.certifications.some(cert => 
            cert.title.toLowerCase().includes(query) || 
            cert.issuer.toLowerCase().includes(query)
          );
          
          return nameMatch || emailMatch || skillMatch || certMatch;
        });
        
        setProfiles(filteredMockProfiles);
      }
      
      setTabValue(0); // Switch to search results tab
    } catch (error) {
      console.error('Error searching profiles:', error);
      
      // Filter mock data on error
      console.log('Using mock data due to search API error');
      const mockProfiles = getMockProfiles();
      const filteredMockProfiles = mockProfiles.filter(profile => {
        const query = searchQuery.toLowerCase();
        const nameMatch = profile.name.toLowerCase().includes(query);
        const emailMatch = profile.email.toLowerCase().includes(query);
        return nameMatch || emailMatch;
      });
      
      setProfiles(filteredMockProfiles);
      setError('Could not search server profiles. Using filtered sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProfiles = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First try to fetch from API
      console.log('Attempting to fetch profiles from API...');
      const response = await api.get('/search/profiles');
      console.log('API response:', response);
      
      if (response.data && response.data.length > 0) {
        // If API returns profiles, use them
        console.log('Profiles successfully fetched from API:', response.data);
        setProfiles(response.data);
      } else {
        // If API returns empty array, use mock data
        console.log('API returned no profiles, using mock data');
        const mockProfiles = getMockProfiles();
        setProfiles(mockProfiles);
      }
    } catch (error) {
      // If API request fails, log error and use mock data
      console.error('Error fetching profiles:', error);
      console.log('Using mock data due to API error');
      const mockProfiles = getMockProfiles();
      setProfiles(mockProfiles);
      setError('Could not fetch profiles from server. Using sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get mock profiles
  const getMockProfiles = () => {
    return [
      {
        _id: '111111111111111111111111',
        name: 'John Doe',
        email: 'john.doe@example.com',
        skills: [
          { _id: 'js1', name: 'JavaScript', level: 'Advanced' },
          { _id: 'react1', name: 'React', level: 'Intermediate' },
          { _id: 'node1', name: 'Node.js', level: 'Advanced' }
        ],
        certifications: [
          { _id: 'cert1', title: 'Full Stack Developer', issuer: 'Coding Academy' },
          { _id: 'cert2', title: 'AWS Solutions Architect', issuer: 'Amazon' }
        ]
      },
      {
        _id: '222222222222222222222222',
        name: 'Swayam Vijay Pagare',
        email: 'swayam@example.com',
        skills: [
          { _id: 'gdgd1', name: 'GDGD', level: 'Beginner' },
          { _id: 'python1', name: 'Python', level: 'Advanced' },
          { _id: 'bgbc1', name: 'BGBC', level: 'Advanced' }
        ],
        certifications: [
          { _id: 'cert3', title: 'Python', issuer: 'Cisco' },
          { _id: 'cert4', title: 'Python', issuer: 'Hogfn' }
        ]
      },
      {
        _id: '333333333333333333333333',
        name: 'Blender',
        email: 'blender@example.com',
        skills: [
          { _id: 'design1', name: '3D Modeling', level: 'Expert' },
          { _id: 'anim1', name: 'Animation', level: 'Advanced' }
        ],
        certifications: [
          { _id: 'cert5', title: '3D Animation', issuer: 'Blender Foundation' }
        ]
      }
    ];
  };

  // Debug the profile data
  useEffect(() => {
    console.log('Current profiles in state:', profiles);
  }, [profiles]);

  const handleProfileSelect = (profile) => {
    // Check if profile is already selected
    if (selectedProfiles.some(p => p._id === profile._id)) {
      return;
    }
    
    if (selectedProfiles.length < 2) {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  const handleCompare = async () => {
    if (selectedProfiles.length !== 2) return;

    setLoading(true);
    setError('');
    
    try {
      console.log('Comparing profiles:', selectedProfiles);
      const response = await api.post('/profiles/compare', {
        userId1: selectedProfiles[0]._id,
        userId2: selectedProfiles[1]._id
      });
      
      console.log('Comparison response:', response);
      setComparisonResult(response.data);
    } catch (err) {
      console.error('Error comparing profiles:', err);
      
      // Generate mock comparison result if API fails
      console.log('Generating mock comparison result');
      
      const mockComparisonResult = {
        commonSkills: selectedProfiles[0].skills.filter(skill1 => 
          selectedProfiles[1].skills.some(skill2 => skill1.name === skill2.name)
        ).length,
        commonCertifications: selectedProfiles[0].certifications.filter(cert1 => 
          selectedProfiles[1].certifications.some(cert2 => cert1.title === cert2.title)
        ).length,
        skillMatchPercentage: 60,
        analysis: {
          commonSkills: [
            { name: "Python", proficiency: "Advanced" }
          ],
          uniqueSkills: [
            {
              user: "user1",
              skills: selectedProfiles[0].skills
                .filter(skill1 => !selectedProfiles[1].skills.some(skill2 => skill1.name === skill2.name))
                .map(skill => ({ name: skill.name, proficiency: skill.level }))
            },
            {
              user: "user2",
              skills: selectedProfiles[1].skills
                .filter(skill2 => !selectedProfiles[0].skills.some(skill1 => skill1.name === skill2.name))
                .map(skill => ({ name: skill.name, proficiency: skill.level }))
            }
          ],
          recommendations: {
            skillGaps: [
              {
                user: "user1",
                skills: [
                  { 
                    skill: "3D Modeling", 
                    suggestedCertifications: ["Blender Certification", "3D Design Fundamentals"] 
                  }
                ]
              },
              {
                user: "user2",
                skills: [
                  { 
                    skill: "JavaScript", 
                    suggestedCertifications: ["Web Development Certification", "JavaScript Developer Certification"] 
                  }
                ]
              }
            ],
            careerPaths: [
              { 
                path: "Full Stack Developer", 
                requiredSkills: ["JavaScript", "React", "Node.js"], 
                suggestedCertifications: ["Web Development", "Full Stack Engineer"] 
              },
              { 
                path: "Data Scientist", 
                requiredSkills: ["Python", "Data Analysis"], 
                suggestedCertifications: ["Data Science", "Machine Learning"] 
              }
            ]
          }
        }
      };
      
      setComparisonResult(mockComparisonResult);
      setError('Could not compare profiles via API. Using sample comparison result.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfile = (index) => {
    setSelectedProfiles(selectedProfiles.filter((_, i) => i !== index));
    setComparisonResult(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonSearchIcon sx={{ mr: 1 }} />
          Search and Compare Profiles
        </Typography>

        {/* Selected Profiles */}
        {selectedProfiles.length > 0 && (
          <Box sx={{ mb: 4, mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleAltIcon sx={{ mr: 1 }} />
              Selected Profiles ({selectedProfiles.length}/2)
            </Typography>
            <Grid container spacing={2}>
              {selectedProfiles.map((profile, index) => (
                <Grid item xs={12} md={6} key={profile._id}>
                  <Card sx={{ position: 'relative' }}>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveProfile(index)}
                      sx={{ position: 'absolute', top: 5, right: 5 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <CardContent>
                      <Typography variant="h6">{profile.name}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {profile.email}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>Skills:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {profile.skills && profile.skills.length > 0 ? 
                            profile.skills.map((skill, i) => (
                              <Chip 
                                key={i} 
                                label={skill.name} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                            )) : 
                            <Typography variant="body2" color="text.secondary">No skills</Typography>
                          }
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>Certifications:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {profile.certifications && profile.certifications.length > 0 ? 
                            profile.certifications.map((cert, i) => (
                              <Chip 
                                key={i} 
                                label={cert.title} 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                              />
                            )) : 
                            <Typography variant="body2" color="text.secondary">No certifications</Typography>
                          }
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {selectedProfiles.length === 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCompare}
                disabled={loading}
                startIcon={<CompareArrowsIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Compare Profiles'}
              </Button>
            )}
          </Box>
        )}

        {/* Search Form */}
        <Box sx={{ mb: 4, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search Profiles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skills, or certifications"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading || !searchQuery.trim()}
                    startIcon={<SearchIcon />}
                  >
                    {loading && tabValue === 0 ? <CircularProgress size={24} /> : 'Search'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => { setTabValue(1); fetchAllProfiles(); }}
                    disabled={loading}
                    startIcon={<PeopleAltIcon />}
                  >
                    {loading && tabValue === 1 ? <CircularProgress size={24} /> : 'Show All Profiles'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Search Results" />
            <Tab label="All Profiles" />
          </Tabs>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Profiles List */}
        {!comparisonResult && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {tabValue === 0 ? 'Search Results' : 'All Profiles'} 
              {profiles.length > 0 && ` (${profiles.length})`}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : profiles.length === 0 ? (
              <Typography color="textSecondary" sx={{ textAlign: 'center', my: 4 }}>
                {tabValue === 0 
                  ? 'No profiles found. Try a different search term or view all profiles.' 
                  : 'No profiles available.'}
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {profiles.map((profile) => {
                  const isSelected = selectedProfiles.some(p => p._id === profile._id);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={profile._id}>
                      <Card 
                        sx={{ 
                          border: isSelected ? '2px solid #2196f3' : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6">{profile.name}</Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {profile.email}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>Skills:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                              {profile.skills && profile.skills.length > 0 ? 
                                profile.skills.slice(0, 5).map((skill, i) => (
                                  <Chip 
                                    key={i} 
                                    label={skill.name} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined" 
                                  />
                                )) : 
                                <Typography variant="body2" color="text.secondary">No skills</Typography>
                              }
                              {profile.skills && profile.skills.length > 5 && (
                                <Chip label={`+${profile.skills.length - 5} more`} size="small" />
                              )}
                            </Box>
                            
                            <Typography variant="subtitle2" gutterBottom>Certifications:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {profile.certifications && profile.certifications.length > 0 ? 
                                profile.certifications.slice(0, 3).map((cert, i) => (
                                  <Chip 
                                    key={i} 
                                    label={cert.title} 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined" 
                                  />
                                )) : 
                                <Typography variant="body2" color="text.secondary">No certifications</Typography>
                              }
                              {profile.certifications && profile.certifications.length > 3 && (
                                <Chip label={`+${profile.certifications.length - 3} more`} size="small" />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant={isSelected ? "outlined" : "contained"}
                            color={isSelected ? "error" : "primary"}
                            onClick={() => isSelected 
                              ? setSelectedProfiles(selectedProfiles.filter(p => p._id !== profile._id)) 
                              : handleProfileSelect(profile)
                            }
                            disabled={!isSelected && selectedProfiles.length >= 2}
                            fullWidth
                          >
                            {isSelected ? "Remove" : selectedProfiles.length >= 2 
                              ? "Selection Full" 
                              : "Select for Comparison"
                            }
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {/* Comparison Results */}
        {comparisonResult && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Comparison Results
            </Typography>

            {/* Common Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Common Skills
              </Typography>
              <Grid container spacing={2}>
                {comparisonResult.analysis.commonSkills.map((skill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1">{skill.name}</Typography>
                        <Typography color="textSecondary">
                          Proficiency: {skill.proficiency}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Unique Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Unique Skills
              </Typography>
              {comparisonResult.analysis.uniqueSkills.map((userSkills, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {userSkills.user === 'user1'
                      ? selectedProfiles[0].name
                      : selectedProfiles[1].name}
                  </Typography>
                  <Grid container spacing={2}>
                    {userSkills.skills.map((skill, skillIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={skillIndex}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1">
                              {skill.name}
                            </Typography>
                            <Typography color="textSecondary">
                              Proficiency: {skill.proficiency}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>

            {/* Recommendations */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              {comparisonResult.analysis.recommendations.skillGaps.map(
                (userGaps, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {userGaps.user === 'user1'
                        ? selectedProfiles[0].name
                        : selectedProfiles[1].name}
                    </Typography>
                    <List>
                      {userGaps.skills.map((gap, gapIndex) => (
                        <ListItem key={gapIndex}>
                          <ListItemText
                            primary={gap.skill}
                            secondary={`Suggested Certifications: ${gap.suggestedCertifications.join(
                              ', '
                            )}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              )}
            </Box>

            {/* Career Paths */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Suggested Career Paths
              </Typography>
              <Grid container spacing={2}>
                {comparisonResult.analysis.recommendations.careerPaths.map(
                  (path, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{path.path}</Typography>
                          <List>
                            <ListItem>
                              <ListItemText
                                primary="Required Skills"
                                secondary={path.requiredSkills.join(', ')}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Suggested Certifications"
                                secondary={path.suggestedCertifications.join(
                                  ', '
                                )}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchProfiles; 