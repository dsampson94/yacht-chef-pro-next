'use client';

import { useState } from 'react';
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

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRole) {
            setError('Please select a role.');
            return;
        }

        const user = {
            email,
            username,
            password,
            role: selectedRole.value,
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                router.push('/user');
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Autocomplete
                    options={roles}
                    getOptionLabel={(option) => option.label}
                    value={selectedRole}
                    onChange={(event, newValue) => setSelectedRole(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Role"
                            fullWidth
                            margin="normal"
                            required
                            error={!!error && !selectedRole}
                            helperText={!!error && !selectedRole ? error : ''}
                        />
                    )}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Create User
                    </Button>
                </Box>
            </form>
            {error && selectedRole && <p>{error}</p>}
        </Box>
    );
};

export default CreateUser;
