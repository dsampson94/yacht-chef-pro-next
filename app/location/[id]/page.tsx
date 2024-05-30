'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Button, TextField } from '@mui/material';
import { apiRequest } from '../../../lib/api';

interface Params {
    params: {
        id: string;
    };
}

export default function EditLocation({ params }: Params) {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = params;
    const [location, setLocation] = useState({ city: '', country: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            apiRequest('locations', 'GET', id)
                .then(data => setLocation(data))
                .catch(error => setError(error.message));
        }
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!location.city || !location.country) {
            setError('City and country are required');
            return;
        }

        try {
            await apiRequest('locations', 'PUT', id, location);
            router.push('/location');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await apiRequest('locations', 'DELETE', id);
            router.push('/location');
        } catch (error) {
            setError(error.message);
        }
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <Box>
            <h1>Edit Location</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="City"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Country"
                    value={location.country}
                    onChange={(e) => setLocation({ ...location, country: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button type="submit" variant="contained" color="primary">Update</Button>
                    <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
                </Box>
            </form>
            {error && <p>{error}</p>}
        </Box>
    );
}
