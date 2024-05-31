// components/Sidebar.tsx

'use client';

import React from 'react';
import {
    Box,
    ButtonBase,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ListAltIcon from '@mui/icons-material/ListAlt';
import KitchenIcon from '@mui/icons-material/Kitchen';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const menuItems = [
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Users', icon: <PeopleIcon />, path: '/user' },
        { text: 'Orders', icon: <ShoppingCartIcon />, path: '/order' },
        { text: 'Menus', icon: <RestaurantMenuIcon />, path: '/menu' },
        { text: 'Menu Items', icon: <ListAltIcon />, path: '/item' },
        { text: 'Ingredients', icon: <KitchenIcon />, path: '/ingredient' },
        { text: 'Locations', icon: <LocationOnIcon />, path: '/location' },
        { text: 'Suppliers', icon: <LocalGroceryStoreIcon />, path: '/supplier' },
        { text: 'Reviews', icon: <RateReviewIcon />, path: '/review' }
    ];

    return (
        <Box
            sx={{
                maxWidth: isOpen ? 200 : 60,
                minWidth: isOpen ? 200 : 60,
                transition: 'width 0.3s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRight: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar>
                <IconButton onClick={toggleSidebar} edge="start" color="inherit" aria-label="toggle sidebar">
                    {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>
            <List>
                {menuItems.map(({ text, icon, path }) => (
                    <Tooltip title={!isOpen ? text : ''} key={text} placement="right">
                        <ListItem
                            sx={{
                                backgroundColor: pathname === path ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                            }}
                        >
                            <ButtonBase
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    textAlign: 'left'
                                }}
                                onClick={() => handleNavigation(path)}
                            >
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                {isOpen && <ListItemText primary={text} sx={{ textAlign: 'left' }} />}
                            </ButtonBase>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
