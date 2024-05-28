'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the Dashboard
            </Typography>
            <Typography variant="body1">
                This is the main dashboard page. Add your content here.
            </Typography>
        </Box>
    );
};

export default Dashboard;
