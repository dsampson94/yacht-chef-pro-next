'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -3.745,
    lng: -38.523,
};

interface Supplier {
    id: string;
    name: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        city: string;
        country: string;
    };
}

const SupplierMap = () => {
    const [location, setLocation] = useState(center);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const fetchSuppliers = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`/api/suppliers?lat=${lat}&lng=${lng}`);
            const data: Supplier[] = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setLocation({ lat, lng });
            fetchSuppliers(lat, lng);
        }
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Supplier Map
            </Typography>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={10}
                    onClick={handleMapClick}
                >
                    {suppliers.map((supplier) => (
                        <Marker
                            key={supplier.id}
                            position={{ lat: supplier.location.lat, lng: supplier.location.lng }}
                            onClick={() => setSelectedSupplier(supplier)}
                        />
                    ))}
                    {selectedSupplier && (
                        <InfoWindow
                            position={{ lat: selectedSupplier.location.lat, lng: selectedSupplier.location.lng }}
                            onCloseClick={() => setSelectedSupplier(null)}
                        >
                            <div>
                                <h2>{selectedSupplier.name}</h2>
                                <p>{selectedSupplier.description}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            <List>
                {suppliers.map((supplier) => (
                    <ListItem key={supplier.id}>
                        <ListItemText primary={supplier.name} secondary={`${supplier.location.city}, ${supplier.location.country}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SupplierMap;
