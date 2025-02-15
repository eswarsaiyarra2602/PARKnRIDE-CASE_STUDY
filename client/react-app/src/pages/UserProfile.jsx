import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'John Doe',
      email: 'john@example.com',
      contact: '1234567890',
      metroCard: 'MC123456',
      rides: ['Ride to Airport - 12 Feb', 'Daily Commute - 14 Feb'],
      parkingReservation: ['Central Mall A1 - 13 Feb', 'Tech Park B2 - 15 Feb'],
      role: 'user',
      rewardCoins: 150
    };
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Profile
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Name"
                      name="name"
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      name="email"
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Contact"
                      name="contact"
                      value={isEditing ? editedProfile.contact : profile.contact}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <TextField
                      label="Metro Card"
                      name="metroCard"
                      value={isEditing ? editedProfile.metroCard : profile.metroCard}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                      InputProps={{
                        startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Chip
                      label={profile.role.toUpperCase()}
                      color={profile.role === 'admin' ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reward Coins
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: 'warning.main' }} />
                      <Typography variant="h5">{profile.rewardCoins}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ mt: 2 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Recent Rides"
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {profile.rides.map((ride, index) => (
                                <Chip
                                  key={index}
                                  icon={<DirectionsCarIcon />}
                                  label={ride}
                                  size="small"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Parking Reservations"
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {profile.parkingReservation.map((parking, index) => (
                                <Chip
                                  key={index}
                                  icon={<LocalParkingIcon />}
                                  label={parking}
                                  size="small"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;