'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Button, TextField } from '@mui/material';
import { useResource } from '../lib/hooks/useResource';

interface Field {
    label: string;
    key: string;
    type?: string;
    options?: string[];
}

interface Params {
    resource: string;
    fields: Field[];
}

const ResourceCreate = ({ resource, fields }: Params) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { createItem } = useResource(resource);
    const [item, setItem] = useState<any>({});
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await createItem(item);
            router.push(`/${resource.slice(0, -1)}`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <Box>
            <h1>Create {resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
            <form onSubmit={handleSubmit}>
                {fields.map(field => (
                    <TextField
                        key={field.key}
                        label={field.label}
                        value={item[field.key] || ''}
                        onChange={(e) => setItem({ ...item, [field.key]: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                ))}
                <Button type="submit" variant="contained" color="primary">Create</Button>
            </form>
            {error && <p>{error}</p>}
        </Box>
    );
};

export default ResourceCreate;
