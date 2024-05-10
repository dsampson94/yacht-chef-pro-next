"use client"

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';

export const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                    onClick={ handleMenuClick }
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={ anchorEl }
                    anchorOrigin={ {
                        vertical: 'top',
                        horizontal: 'left'
                    } }
                    keepMounted
                    transformOrigin={ {
                        vertical: 'top',
                        horizontal: 'left'
                    } }
                    open={ open }
                    onClose={ handleMenuClose }
                >
                    <MenuItem onClick={ handleMenuClose }>Profile</MenuItem>
                    <MenuItem onClick={ handleMenuClose }>My account</MenuItem>
                    <MenuItem onClick={ handleMenuClose }>Logout</MenuItem>
                </Menu>
                <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
                    Invoisseur
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};
