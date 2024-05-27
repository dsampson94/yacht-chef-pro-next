'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box, Button, TextField } from '@mui/material';
import AppLayout from '../../../app/AppLayout';

export default function EditLocation() {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [location, setLocation] = useState({ city: '', country: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetch(`/api/location/${ id }`)
                .then(response => response.json())
                .then(data => setLocation(data));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location.city || !location.country) {
            setError('City and country are required');
            return;
        }

        try {
            const res = await fetch(`/api/location/${ id }`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(location)
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

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/location/${ id }`, {
                method: 'DELETE'
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
                <h1>Edit Location</h1>
                <form onSubmit={ handleSubmit }>
                    <TextField
                        label="City"
                        value={ location.city }
                        onChange={ (e) => setLocation({ ...location, city: e.target.value }) }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Country"
                        value={ location.country }
                        onChange={ (e) => setLocation({ ...location, country: e.target.value }) }
                        fullWidth
                        margin="normal"
                    />
                    <Box mt={ 2 } display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary">Update</Button>
                        <Button onClick={ handleDelete } variant="contained" color="secondary">Delete</Button>
                    </Box>
                </form>
                { error && <p>{ error }</p> }
            </Box>
        </AppLayout>
    );
}
