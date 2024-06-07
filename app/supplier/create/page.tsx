'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Location {
    id: string;
    city: string;
    country: string;
}

const CreateSupplier = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState<Location | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                const data: Location[] = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const supplierData = {
            name,
            email,
            phone,
            locationId: location?.id || null,
        };

        try {
            const response = await fetch('/api/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierData),
            });

            if (response.ok) {
                alert('Supplier created successfully');
                router.push('/supplier');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating supplier:', error);
            alert('An error occurred while creating the supplier.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <Autocomplete
                    options={locations}
                    getOptionLabel={(option: Location) => `${option.city}, ${option.country}`}
                    value={location}
                    onChange={(event, newValue: Location | null) => setLocation(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Location" margin="normal" fullWidth />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Create Supplier
            </Button>
        </form>
    );
};

export default CreateSupplier;
