'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

interface Location {
    id: string;
    city: string;
    country: string;
}

interface Ingredient {
    id: string;
    name: string;
}

const EditSupplier = () => {
    const router = useRouter();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState<Location | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationId, setLocationId] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await fetch(`/api/suppliers/${id}`);
                const data = await response.json();
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setLocationId(data.locationId); // Store locationId
                setIngredients(data.supplierIngredients.map((si: any) => si.ingredient));
            } catch (error) {
                console.error('Error fetching supplier:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                const data: Location[] = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        const fetchAllIngredients = async () => {
            try {
                const response = await fetch('/api/ingredients');
                const data: Ingredient[] = await response.json();
                setAllIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchSupplier();
        fetchLocations();
        fetchAllIngredients();
    }, [id]);

    useEffect(() => {
        const fetchLocation = async () => {
            if (locationId) {
                try {
                    const response = await fetch(`/api/locations/${locationId}`);
                    const data: Location = await response.json();
                    setLocation(data);
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            }
        };

        fetchLocation();
    }, [locationId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const supplierData = {
            name,
            email,
            phone,
            locationId: location?.id,
            ingredients: ingredients.map(ingredient => ({ id: ingredient.id }))
        };

        try {
            const response = await fetch(`/api/suppliers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierData),
            });

            if (response.ok) {
                alert('Supplier updated successfully');
                router.push('/supplier');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('An error occurred while updating the supplier.');
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
                        <TextField {...params} label="Location" margin="normal" required fullWidth />
                    )}
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={allIngredients}
                    getOptionLabel={(option: Ingredient) => option.name}
                    value={ingredients}
                    onChange={(event, newValue: Ingredient[]) => setIngredients(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingredients"
                            margin="normal"
                            fullWidth
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Update Supplier
            </Button>
        </form>
    );
};

export default EditSupplier;
