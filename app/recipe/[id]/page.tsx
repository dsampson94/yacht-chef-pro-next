'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

interface Ingredient {
    id: string;
    name: string;
}

interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: {
        ingredient: Ingredient;
    }[];
}

const EditRecipe = () => {
    const router = useRouter();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`/api/recipes/${id}`);
                const data: Recipe = await response.json();
                setName(data.name);
                setDescription(data.description);
                setSelectedIngredients(data.ingredients.map(ri => ri.ingredient));
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        const fetchIngredients = async () => {
            try {
                const response = await fetch('/api/ingredients');
                const data: Ingredient[] = await response.json();
                setIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchRecipe();
        fetchIngredients();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedIngredients.length === 0) {
            setAutocompleteError(true);
            return;
        }

        const recipeData = {
            name,
            description,
            ingredients: selectedIngredients.map(ingredient => ({ id: ingredient.id })),
        };

        try {
            const response = await fetch(`/api/recipes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                alert('Recipe updated successfully');
                router.push('/recipe');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('An error occurred while updating the recipe.');
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
                Update Recipe
            </Button>
        </form>
    );
};

export default EditRecipe;
