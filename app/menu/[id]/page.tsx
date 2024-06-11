'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Recipe {
    id: string;
    name: string;
}

interface Menu {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    weekOfYear: number;
    recipes: Recipe[];
}

const EditMenu = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weekOfYear, setWeekOfYear] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);
    const [userId, setUserId] = useState(''); // Assuming you have a way to get the user ID
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                const data: Recipe[] = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchMenu = async () => {
                try {
                    const response = await fetch(`/api/menus/${id}`);
                    const data: Menu = await response.json();
                    setName(data.name);
                    setDescription(data.description);
                    setStartDate(data.startDate.split('T')[0]);
                    setEndDate(data.endDate.split('T')[0]);
                    setWeekOfYear(data.weekOfYear.toString());
                    setSelectedRecipes(data.recipes);
                } catch (error) {
                    console.error('Error fetching menu:', error);
                }
            };

            fetchMenu();
        }
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedRecipes.length === 0) {
            setAutocompleteError(true);
            return;
        }

        const menuData = {
            name,
            description,
            startDate,
            endDate,
            weekOfYear,
            userId,
            recipes: selectedRecipes.map(recipe => ({ id: recipe.id })),
        };

        try {
            const response = await fetch(`/api/menus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData),
            });

            if (response.ok) {
                alert('Menu updated successfully');
                router.push('/menus');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating menu:', error);
            alert('An error occurred while updating the menu.');
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
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <div>
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <div>
                <TextField
                    label="Week of Year"
                    type="number"
                    value={weekOfYear}
                    onChange={(e) => setWeekOfYear(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={recipes}
                    getOptionLabel={(option: Recipe) => option.name}
                    value={selectedRecipes}
                    onChange={(event, newValue: Recipe[]) => {
                        setSelectedRecipes(newValue);
                        if (newValue.length > 0) setAutocompleteError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Recipes"
                            margin="normal"
                            fullWidth
                            error={autocompleteError}
                            helperText={autocompleteError ? "Please select at least one recipe" : ""}
                        />
                    )}
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Update Menu
            </Button>
        </form>
    );
};

export default EditMenu;
