'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Location {
    id: string;
    city: string;
    country: string;
    suppliers: Supplier[];
}

const EditLocation = () => {
    const router = useRouter();
    const { id } = useParams();
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [locationSuppliers, setLocationSuppliers] = useState<Supplier[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch(`/api/locations/${id}`);
                const data: Location = await response.json();
                setCity(data.city);
                setCountry(data.country);
                setLocationSuppliers(data.suppliers);
                setSelectedSuppliers(data.suppliers);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        const fetchSuppliers = async () => {
            try {
                const response = await fetch('/api/suppliers');
                const data: Supplier[] = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchLocation();
        fetchSuppliers();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedSuppliers.length === 0) {
            setAutocompleteError(true);
            return;
        }

        const locationData = {
            city,
            country,
            suppliers: selectedSuppliers.map(supplier => ({ id: supplier.id })),
        };

        try {
            const response = await fetch(`/api/locations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData),
            });

            if (response.ok) {
                alert('Location updated successfully');
                router.push('/locations'); // Redirect to the locations list page
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating location:', error);
            alert('An error occurred while updating the location.');
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
                    onChange={(event, newValue: Supplier[]) => {
                        setSelectedSuppliers(newValue);
                        if (newValue.length > 0) setAutocompleteError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Suppliers"
                            margin="normal"
                            fullWidth
                            error={autocompleteError}
                            helperText={autocompleteError ? "Please select at least one supplier" : ""}
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Update Location
            </Button>
        </form>
    );
};

export default EditLocation;
