import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { Box, Grid, TextField, Button, Typography, InputLabel, MenuItem, Select } from '@mui/material';
import './Forms.css';

const AdminRegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        gender: '',
        address: '',
        id_number: '',
        phone: '',
    });

    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {
        const isFormFilled = Object.values(formData).every(value => value.trim() !== '');
        setIsButtonActive(isFormFilled);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isButtonActive) return; // Prevent submission if button is inactive

        try {
          await api.post('/create-admin/', formData);
          toast.success('Admin user created successfully!');
          setFormData({
            email: '',
            firstname: '',
            lastname: '',
            username: '',
            gender: '',
            address: '',
            id_number: '',
            phone: '',
          });
        } catch (err) {
          toast.error(err.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
            <Typography variant="h6" component="p" gutterBottom>
                Admin Registration Form
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="firstname"
                        label="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="lastname"
                        label="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="username"
                        label="Username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
            </Grid>
            
            <Typography variant="h6" component="p" gutterBottom sx={{ mt: 4 }}>
                Contact Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="phone"
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="id_number"
                        label="ID Number"
                        value={formData.id_number}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        name="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        fullWidth
                        label="Gender"
                        size="small"
                    >
                        <MenuItem value="" disabled>Gender</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </Select>
                </Grid>
            </Grid>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.5, fontSize: '16px' }}
                disabled={!isButtonActive}
                style={{
                    backgroundColor: isButtonActive ? "#135D66" : "#6c757da7",
                    cursor: isButtonActive ? "pointer" : "not-allowed",
                }}
            >
                Register Admin
            </Button>
        </Box>
    );
};

export default AdminRegistrationForm;
