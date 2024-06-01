'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Button } from '@mui/material';
import { useResource } from '../lib/hooks/useResource';
import DynamicForm from './DynamicForm';
import { Field } from '../lib/types';

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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (id) {
            fetchItem(parseInt(id))
                .then(data => setItem(data))
                .catch(error => setError(error.message));
        }
    }, [id, fetchItem]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validationErrors: { [key: string]: string } = {};
        fields.forEach(field => {
            if (field.required && !item[field.key]) {
                validationErrors[field.key] = `${field.label} is required`;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

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

    const handleFieldChange = (key: string, value: any, field: Field) => {
        setItem({ ...item, [key]: value });
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <Box>
            <h1>Edit {resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
            <form onSubmit={handleSubmit}>
                <DynamicForm fields={fields} item={item} errors={errors} handleFieldChange={handleFieldChange} />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button type="submit" variant="contained" color="primary">Update</Button>
                    <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
                </Box>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Box>
    );
};

export default ResourceEdit;
