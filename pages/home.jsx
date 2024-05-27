import React from 'react';
import { Container, Typography, List, Divider } from '@mui/material';
import MenuItem from '../components/MenuItem';
import AppLayout from '../app/AppLayout';
import withAuth from '../app/withAuth';

const HomePage = () => {
    const currentWeekMenu = [
        { id: '1', name: 'Grilled Salmon', description: 'Served with a side of vegetables.' },
        { id: '2', name: 'Steak Frites', description: 'Juicy steak with crispy fries.' },
        { id: '3', name: 'Caesar Salad', description: 'Classic Caesar with homemade dressing.' },
    ];

    return (
        <AppLayout>
            <Container component="main">
                <Typography variant="h4" gutterBottom>
                    This Week's Menu
                </Typography>
                <List>
                    {currentWeekMenu.map((item) => (
                        <React.Fragment key={item.id}>
                            <MenuItem name={item.name} description={item.description} />
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Container>
        </AppLayout>
    );
};

HomePage.displayName = 'HomePage';

export default withAuth(HomePage);
