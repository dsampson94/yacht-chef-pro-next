'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import AppLayout from '../../../app/AppLayout';

export default function Locations() {
    const { data: session } = useSession();
    const [locations, setLocations] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            fetch('/api/location')
                .then(response => response.json())
                .then(data => setLocations(data));
        }
    }, [session]);

    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <AppLayout>
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={ 2 }>
                    <h1>Locations</h1>
                    <Link href="/app/location/create" passHref>
                        <Button variant="contained" color="primary">Create New Location</Button>
                    </Link>
                </Box>
                <TableContainer component={ Paper }>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>City</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { locations.map((location) => (
                                <TableRow key={ location.id }>
                                    <TableCell>{ location.city }</TableCell>
                                    <TableCell>{ location.country }</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={ () => router.push(`/location/${ location.id }`) }
                                        >
                                            Edit/View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </AppLayout>
    );
}
