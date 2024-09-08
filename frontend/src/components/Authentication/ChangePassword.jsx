import React, { useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        try {
            const response = await api.post('/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });

            if (response.status === 200) {
                toast.success('Password changed successfully!');
                // Clear form fields after a successful change
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const { detail, errors, password_requirements } = error.response.data;

                if (errors) {
                    errors.forEach(err => toast.error(err));
                } else {
                    toast.error(detail);
                }

                if (password_requirements) {
                    password_requirements.forEach(requirement => toast.info(requirement));
                }
            } else {
                toast.error('Password change failed. Please try again.');
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
            <TextField
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Change Password
            </Button>
        </Box>
    );
};

export default ChangePasswordForm;
