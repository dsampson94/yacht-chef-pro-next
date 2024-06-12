'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TextField, Button, Autocomplete, Box, MenuItem, Select } from '@mui/material';

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
    recipes: { recipe: Recipe, day: string, meal: string }[];
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const EditMenu = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weekOfYear, setWeekOfYear] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<{ recipe: Recipe, day: string, meal: string }[]>([]);
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

    const handleAddRecipe = () => {
        setSelectedRecipes([...selectedRecipes, { recipe: { id: '', name: '' }, day: '', meal: '' }]);
    };

    const handleRecipeChange = (index: number, field: 'recipe' | 'day' | 'meal', value: any) => {
        const updatedRecipes = [...selectedRecipes];
        if (field === 'recipe') {
            updatedRecipes[index].recipe = recipes.find(r => r.id === value) || { id: '', name: '' };
        } else {
            updatedRecipes[index][field] = value;
        }
        setSelectedRecipes(updatedRecipes);
    };

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
            weekOfYear: parseInt(weekOfYear, 10),
            userId,
            recipes: selectedRecipes.map(item => ({ id: item.recipe.id, day: item.day, meal: item.meal })),
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
                <Button variant="contained" color="primary" onClick={handleAddRecipe}>
                    Add Recipe
                </Button>
            </div>
            {selectedRecipes.map((selectedRecipe, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2} mt={2}>
                    <Autocomplete
                        options={recipes}
                        getOptionLabel={(option: Recipe) => option.name}
                        value={selectedRecipe.recipe}
                        onChange={(event, newValue: Recipe | null) => handleRecipeChange(index, 'recipe', newValue?.id)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Recipe"
                                margin="normal"
                                fullWidth
                                error={autocompleteError}
                                helperText={autocompleteError ? 'Please select at least one recipe' : ''}
                            />
                        )}
                        style={{ flex: 1 }}
                    />
                    <Select
                        value={selectedRecipe.day}
                        onChange={(e) => handleRecipeChange(index, 'day', e.target.value)}
                        displayEmpty
                        fullWidth
                        style={{ flex: 1 }}
                    >
                        <MenuItem value="" disabled>Select Day</MenuItem>
                        {daysOfWeek.map(day => (
                            <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={selectedRecipe.meal}
                        onChange={(e) => handleRecipeChange(index, 'meal', e.target.value)}
                        displayEmpty
                        fullWidth
                        style={{ flex: 1 }}
                    >
                        <MenuItem value="" disabled>Select Meal</MenuItem>
                        {mealTimes.map(meal => (
                            <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                        ))}
                    </Select>
                </Box>
            ))}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Update Menu
            </Button>
        </form>
    );
};

export default EditMenu;
