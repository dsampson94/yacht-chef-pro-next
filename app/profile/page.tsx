'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Autocomplete } from '@mui/material';

interface Role {
    label: string;
    value: string;
}

const roles: Role[] = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'CHEF', value: 'CHEF' },
    { label: 'USER', value: 'USER' }
];

const Profile = () => {
    const { data: session, status } = useSession();
    // @ts-ignore
    const userId = session?.user?.id;
    const router = useRouter();
    const [user, setUser] = useState<any>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            fetch(`/api/users/${userId}`)
                .then(response => response.json())
                .then(data => setUser(data))
                .catch(error => setError(error.message));
        }
    }, [userId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                router.push('/profile'); // refresh the profile page
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
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
                <Autocomplete
                    multiple
                    options={roles}
                    getOptionLabel={(option) => option.label}
                    value={roles.filter(role => user.role && user.role.includes(role.value))}
                    onChange={(event, newValue) => {
                        setUser({ ...user, role: newValue.map(role => role.value) });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Role"
                            fullWidth
                            margin="normal"
                        />
                    )}
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
