'use client';

import { FormEvent, useEffect, useState } from 'react';
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
    id: string;
    resource: string;
    fields: Field[];
}

const ResourceEdit = ({ id, resource, fields }: Params) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { fetchItem, updateItem, deleteItem } = useResource(resource);
    const [item, setItem] = useState<any>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchItem(parseInt(id))
                .then(data => setItem(data))
                .catch(error => setError(error.message));
        }
    }, [id, fetchItem]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await updateItem(parseInt(id), item);
            router.push(`/${resource.slice(0, -1)}`);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteItem(parseInt(id));
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
            <h1>Edit {resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
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
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button type="submit" variant="contained" color="primary">Update</Button>
                    <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
                </Box>
            </form>
            {error && <p>{error}</p>}
        </Box>
    );
};

export default ResourceEdit;
