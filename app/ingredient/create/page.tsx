'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Supplier {
    id: string;
    name: string;
    locationId: string;
    location: {
        id: string;
        city: string;
        country: string;
    };
}

const CreateIngredient = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState('');
    const [price, setPrice] = useState('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);
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

        if (selectedSuppliers.length === 0) {
            setAutocompleteError(true);
            return;
        }

        const ingredientData = {
            name,
            description,
            weight: parseFloat(weight),
            price: parseFloat(price),
            suppliers: selectedSuppliers.map(supplier => ({
                id: supplier.id,
                locationId: supplier.locationId
            })),
        };

        try {
            const response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ingredientData),
            });

            if (response.ok) {
                alert('Ingredient created successfully');
                router.push('/ingredient');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating ingredient:', error);
            alert('An error occurred while creating the ingredient.');
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
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={suppliers}
                    getOptionLabel={(option: Supplier) => `${option.name} (${option.location.city}, ${option.location.country})`}
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
                Create Ingredient
            </Button>
        </form>
    );
};

export default CreateIngredient;
