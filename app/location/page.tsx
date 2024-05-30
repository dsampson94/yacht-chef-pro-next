'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { apiRequest } from '../../lib/api';

interface Location {
    id: number;
    city: string;
    country: string;
}

const Locations = () => {
    const { data: session } = useSession();
    const [locations, setLocations] = useState<Location[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            apiRequest('locations')
                .then(data => setLocations(data))
                .catch(error => console.error('Error fetching locations:', error));
        }
    }, [session]);

    const deleteLocation = async (id: number) => {
        try {
            await apiRequest('locations', 'DELETE', id);
            setLocations(locations.filter(location => location.id !== id));
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h1>Locations</h1>
                <Link href="/location/create" passHref>
                    <Button variant="contained" color="primary">Create New Location</Button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell>{location.city}</TableCell>
                                <TableCell>{location.country}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => router.push(`/location/${location.id}`)}
                                    >
                                        Edit/View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteLocation(location.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Locations;
