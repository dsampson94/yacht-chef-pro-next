'use client';

import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuClick }) => {
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={ { mr: 2 } }
                    onClick={ onMenuClick }
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
                    Yacht Chef Pro
                </Typography>
                <IconButton onClick={ handleMenuClick } sx={ { p: 0 } }>
                    <Avatar alt={ session.user.name } src={ session.user.image } />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={ anchorEl }
                    anchorOrigin={ {
                        vertical: 'top',
                        horizontal: 'right'
                    } }
                    keepMounted
                    transformOrigin={ {
                        vertical: 'top',
                        horizontal: 'right'
                    } }
                    open={ open }
                    onClose={ handleMenuClose }
                >
                    <MenuItem onClick={ handleMenuClose }>Profile</MenuItem>
                    <MenuItem onClick={ handleMenuClose }>My account</MenuItem>
                    <MenuItem onClick={ handleSignOut }>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
