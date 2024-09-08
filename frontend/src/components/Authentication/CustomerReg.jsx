import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const CustomerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    id_number: "",
    age: "",
    gender: "",
    branch: "",
    residence: "",
    residence_type: "",
    business_type: "",
    business_area: "",
    next_of_keen: "",
    next_of_keen_contact: "",
    guaranter_firstname: "",
    guaranter_lastname: "",
    guaranter_age: "",
    guaranter_business_type: "",
    guaranter_phone: "",
    guaranter_id: "",
    guaranter_gender: "",
  });

  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const isFormFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
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
      await api.post("/customers/", formData); // Adjust the endpoint as needed
      toast.success("Customer created successfully!");
      setFormData({
        firstname: "",
        lastname: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        id_number: "",
        branch: "",
        residence: "",
        residence_type: "",
        business_type: "",
        business_area: "",
        next_of_keen: "",
        next_of_keen_contact: "",
        guaranter_firstname: "",
        guaranter_lastname: "",
        guaranter_age: "",
        guaranter_business_type: "",
        guaranter_phone: "",
        guaranter_id: "",
        guaranter_gender: "",
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.detail || "An error occurred");
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
        Customer Registration Form
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
            name="age"
            label="Age"
            value={formData.age}
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
            name="email"
            label="Email"
            value={formData.email}
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
        <Grid item xs={12} md={6}>
          <InputLabel id="branch-label">Branch</InputLabel>
          <Select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            fullWidth
            label="Branch"
            size="small"
          >
            <MenuItem value="" disabled>Select Branch</MenuItem>
            <MenuItem value="Nairobi">Nairobi</MenuItem>
            <MenuItem value="Nakuru">Nakuru</MenuItem>
            <MenuItem value="Mombasa">Mombasa</MenuItem>
            <MenuItem value="Eldoret">Eldoret</MenuItem>
            <MenuItem value="Kisii">Kisii</MenuItem>
            <MenuItem value="Narok">Narok</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="residence"
            label="Residence"
            value={formData.residence}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel id="residence-type-label">Residence Type</InputLabel>
          <Select
            id="residence_type"
            name="residence_type"
            value={formData.residence_type}
            onChange={handleChange}
            fullWidth
            label="Residence Type"
            size="small"
          >
            <MenuItem value="" disabled>Select Residence Type</MenuItem>
            <MenuItem value="Area1">Area1</MenuItem>
            <MenuItem value="Area2">Area2</MenuItem>
            <MenuItem value="Area3">Area3</MenuItem>
            <MenuItem value="Area4">Area4</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel id="business-type-label">Business Type</InputLabel>
          <Select
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            fullWidth
            label="Business Type"
            size="small"
          >
            <MenuItem value="" disabled>Select Business Type</MenuItem>
            <MenuItem value="Type1">Type1</MenuItem>
            <MenuItem value="Type2">Type2</MenuItem>
            <MenuItem value="Type3">Type3</MenuItem>
            <MenuItem value="Type4">Type4</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="business_area"
            label="Business Area"
            value={formData.business_area}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="p" gutterBottom sx={{ mt: 4 }}>
        Next of Keen
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            name="next_of_keen"
            label="Next of Keen"
            value={formData.next_of_keen}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="next_of_keen_contact"
            label="Keen Contact"
            value={formData.next_of_keen_contact}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="p" gutterBottom sx={{ mt: 4 }}>
        Guarantor Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="guaranter_firstname"
            label="Guarantor First Name"
            value={formData.guaranter_firstname}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="guaranter_lastname"
            label="Guarantor Last Name"
            value={formData.guaranter_lastname}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="guaranter_age"
            label="Guarantor Age"
            value={formData.guaranter_age}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel id="guaranter-business-type-label">Guarantor Business Type</InputLabel>
          <Select
            id="guaranter_business_type"
            name="guaranter_business_type"
            value={formData.guaranter_business_type}
            onChange={handleChange}
            fullWidth
            label="Guarantor Business Type"
            size="small"
          >
            <MenuItem value="" disabled>Select Guarantor Business Type</MenuItem>
            <MenuItem value="Type1">Type1</MenuItem>
            <MenuItem value="Type2">Type2</MenuItem>
            <MenuItem value="Type3">Type3</MenuItem>
            <MenuItem value="Type4">Type4</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="guaranter_phone"
            label="Guarantor Phone"
            value={formData.guaranter_phone}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="guaranter_id"
            label="Guarantor ID"
            value={formData.guaranter_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel id="guaranter-gender-label">Guarantor Gender</InputLabel>
          <Select
            id="guaranter_gender"
            name="guaranter_gender"
            value={formData.guaranter_gender}
            onChange={handleChange}
            fullWidth
            label="Guarantor Gender"
            size="small"
          >
            <MenuItem value="" disabled>Guarantor Gender</MenuItem>
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
        Create Customer
      </Button>
    </Box>
  );
};

export default CustomerRegistrationForm;
