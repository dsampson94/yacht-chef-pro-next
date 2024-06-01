'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField } from '@mui/material';
import { useResource } from '../../lib/hooks/useResource';

const Profile = () => {
    const { data: session, status } = useSession();
    // @ts-ignore
    const userId = session?.user?.id;
    const router = useRouter();
    const { fetchItem, updateItem } = useResource('users'); // assuming 'users' is the resource name
    const [user, setUser] = useState<any>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            fetchItem(userId)
                .then(data => setUser(data))
                .catch(error => setError(error.message));
        }
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await updateItem(user.id, user);
            router.push('/profile'); // refresh the profile page
        } catch (error) {
            setError(error.message);
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <Box>
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Username"
                    value={user.username || ''}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Role"
                    value={user.role || ''}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={user.password || ''}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Update Profile
                    </Button>
                </Box>
            </form>
            {error && <p>{error}</p>}
        </Box>
    );
};

export default Profile;
