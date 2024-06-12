'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useDownloadPDF from '../lib/hooks/useDownloadPDF';

interface Field {
    label: string;
    key: string;
}

interface ResourceListProps {
    resource: string;
    displayFields: Field[];
}

interface ResourceItem {
    id: string;
    [key: string]: any;
}

const ResourceList = ({ resource, displayFields }: ResourceListProps) => {
    const { data: session } = useSession();
    const [items, setItems] = useState<ResourceItem[]>([]);
    const [error, setError] = useState<string>('');
    const { handleDownloadPDF } = useDownloadPDF();
    const router = useRouter();

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/${resource}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`/api/${resource}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (session) {
            fetchItems();
        }
    }, [session, resource]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h1>{resource.charAt(0).toUpperCase() + resource.slice(1)}</h1>
                <Link href={`/${resource.slice(0, -1)}/create`} passHref>
                    <Button variant="contained" color="primary">Create New {resource.slice(0, -1)}</Button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {displayFields.map(field => (
                                <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>{field.label}</TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                {displayFields.map(field => (
                                    <TableCell key={field.key} sx={{ whiteSpace: 'nowrap' }}>{item[field.key]}</TableCell>
                                ))}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => router.push(`/${resource.slice(0, -1)}/${item.id}`)}
                                    >
                                        Edit/View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteItem(item.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                    {resource === 'orders' && (
                                        <Button
                                            variant="contained"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => handleDownloadPDF(item.id)}
                                        >
                                            Download PDF
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ResourceList;
