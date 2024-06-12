'use client';

import { useState } from 'react';
import { Button, Box, Typography, TextField } from '@mui/material';

const SeedData = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSeed = async () => {
        if (password !== '2411') {
            setError('Incorrect password');
            return;
        }

        setError(null);
        setStatus('Seeding...');
        try {
            const response = await fetch('/api/seed', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setStatus(data.message);
            } else {
                const errorData = await response.json();
                setStatus(`Seeding failed: ${errorData.error}`);
            }
        } catch (error) {
            setStatus(`Seeding failed: ${error.message}`);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Typography variant="h4" component="h1" gutterBottom>
                Seed Database
            </Typography>
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSeed}>
                Seed Data
            </Button>
            {error && <Typography variant="body1" color="error" marginTop="20px">{error}</Typography>}
            {status && <Typography variant="body1" marginTop="20px">{status}</Typography>}
        </Box>
    );
};

export default SeedData;
