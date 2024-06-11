'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResource } from '../lib/hooks/useResource';

interface Field {
    label: string;
    key: string;
}

interface ResourceListProps {
    resource: string;
    displayFields: Field[];
}

const ResourceList = ({ resource, displayFields }: ResourceListProps) => {
    const { items, deleteItem, error } = useResource(resource);
    const router = useRouter();

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
                                    {resource === 'orders' && item.pdfUrl && (
                                        <Button
                                            variant="contained"
                                            style={{ marginLeft: '10px' }}
                                            href={item.pdfUrl}
                                            target="_blank"
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
