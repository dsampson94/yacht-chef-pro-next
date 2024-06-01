'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Button } from '@mui/material';
import { useResource } from '../lib/hooks/useResource';
import DynamicForm from './DynamicForm';
import { Field } from '../lib/types';

interface Params {
    resource: string;
    fields: Field[];
}

const ResourceCreate: React.FC<Params> = ({ resource, fields }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { createItem } = useResource(resource);
    const [item, setItem] = useState<any>({});
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
            await createItem(item);
            router.push(`/${resource.slice(0, -1)}`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    const handleFieldChange = (key: string, value: any, field: Field) => {
        setItem({ ...item, [key]: value });
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    return (
        <Box>
            <h1>Create {resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
            <form onSubmit={handleSubmit}>
                <DynamicForm fields={fields} item={item} errors={errors} handleFieldChange={handleFieldChange} />
                <Button type="submit" variant="contained" color="primary">Create</Button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Box>
    );
};

export default ResourceCreate;
