'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Ingredient {
    id: string;
    name: string;
}

const CreateRecipe = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('/api/ingredients');
                const data: Ingredient[] = await response.json();
                setIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredients();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedIngredients.length === 0) {
            setAutocompleteError(true);
            return;
        }

        const menuItemData = {
            name,
            description,
            ingredients: selectedIngredients.map(ingredient => ({ id: ingredient.id })),
        };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuItemData),
            });

            if (response.ok) {
                alert('Recipe created successfully');
                router.push('/recipe');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('An error occurred while creating the recipe.');
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
                <Autocomplete
                    multiple
                    options={ingredients}
                    getOptionLabel={(option: Ingredient) => option.name}
                    value={selectedIngredients}
                    onChange={(event, newValue: Ingredient[]) => {
                        setSelectedIngredients(newValue);
                        if (newValue.length > 0) setAutocompleteError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingredients"
                            margin="normal"
                            fullWidth
                            error={autocompleteError}
                            helperText={autocompleteError ? "Please select at least one ingredient" : ""}
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Create Recipe
            </Button>
        </form>
    );
};

export default CreateRecipe;
