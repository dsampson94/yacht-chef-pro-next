'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const CreateLocation = () => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch('/api/suppliers');
                const data: Supplier[] = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const locationData = {
            city,
            country,
            suppliers: selectedSuppliers.map(supplier => ({ id: supplier.id })),
        };

        try {
            const response = await fetch('/api/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData),
            });

            if (response.ok) {
                alert('Location created successfully');
                router.push('/location');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating location:', error);
            alert('An error occurred while creating the location.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <TextField
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={suppliers}
                    getOptionLabel={(option: Supplier) => option.name}
                    value={selectedSuppliers}
                    onChange={(event, newValue: Supplier[]) => setSelectedSuppliers(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Suppliers"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Create Location
            </Button>
        </form>
    );
};

export default CreateLocation;
