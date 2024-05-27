import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AppLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <Header onMenuClick={toggleSidebar} />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;
