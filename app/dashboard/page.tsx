'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import MenuCalendar from '../../components/MenuCalendar';

const Dashboard = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the Dashboard
            </Typography>
            <MenuCalendar />
        </Box>
    );
};

export default Dashboard;
