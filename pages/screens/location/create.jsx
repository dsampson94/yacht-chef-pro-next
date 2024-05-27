'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Button, TextField } from '@mui/material';
import AppLayout from '../../../app/AppLayout';

export default function CreateLocation() {
    const { data: session } = useSession();
    const router = useRouter();
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!city || !country) {
            setError('City and country are required');
            return;
        }

        try {
            const res = await fetch('/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ city, country })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/screens/location');
        } catch (error) {
            setError(error.message);
        }
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <AppLayout>
            <Box>
                <h1>Create Location</h1>
                <form onSubmit={ handleSubmit }>
                    <TextField
                        label="City"
                        value={ city }
                        onChange={ (e) => setCity(e.target.value) }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Country"
                        value={ country }
                        onChange={ (e) => setCountry(e.target.value) }
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">Create</Button>
                </form>
                { error && <p>{ error }</p> }
            </Box>
        </AppLayout>
    );
}
