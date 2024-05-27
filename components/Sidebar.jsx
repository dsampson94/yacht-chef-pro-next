import React from 'react';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Box
            sx={ {
                width: isOpen ? 240 : '10%',
                transition: 'width 0.3s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRight: 1,
                borderColor: 'divider'
            } }
        >
            <Toolbar>
                <IconButton onClick={ toggleSidebar } edge="start" color="inherit" aria-label="toggle sidebar">
                    { isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                </IconButton>
            </Toolbar>
            <List>
                <ListItem button onClick={ () => handleNavigation('/home') }>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    { isOpen && <ListItemText primary="Dashboard" /> }
                </ListItem>
                <ListItem button onClick={ () => handleNavigation('/orders') }>
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    { isOpen && <ListItemText primary="Orders" /> }
                </ListItem>
                <ListItem button onClick={ () => handleNavigation('/menus') }>
                    <ListItemIcon>
                        <RestaurantMenuIcon />
                    </ListItemIcon>
                    { isOpen && <ListItemText primary="Menus" /> }
                </ListItem>
                <ListItem button onClick={ () => handleNavigation('/reviews') }>
                    <ListItemIcon>
                        <RateReviewIcon />
                    </ListItemIcon>
                    { isOpen && <ListItemText primary="Reviews" /> }
                </ListItem>
                <ListItem button onClick={ () => handleNavigation('/profile') }>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    { isOpen && <ListItemText primary="Profile" /> }
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
