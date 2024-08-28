import { useNavigate } from 'react-router-dom';
import {useState} from 'react'
import api from '../../api';
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const LogOut = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                // Blacklist the refresh token on the server
                await api.post('/logout/', {"refresh": refreshToken });
                console.log("Token blacklisted");  // Debugging line
                // Clear tokens from localStorage
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
            }
            // Navigate to the login page
            navigate('/');
            console.log("Navigating to login page");  // Debugging line
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Button fullWidth={true} size='small' variant="outlined" onClick={handleLogout} startIcon={<Logout />}>LogOut</Button>
    );
};

export default LogOut;
