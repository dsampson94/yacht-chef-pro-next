'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Autocomplete, Button, TextField } from '@mui/material';

interface Recipe {
    id: string;
    name: string;
}

interface Menu {
    id: string;
    name: string;
    description: string;
    weekOfYear: number;
    startDate: string;
    endDate: string;
    recipes: Recipe[];
    user: {
        id: string;
    };
}

const EditMenu = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [weekOfYear, setWeekOfYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`/api/menus/${id}`);
                const data: Menu = await response.json();
                setName(data.name);
                setDescription(data.description);
                setWeekOfYear(data.weekOfYear.toString());
                setStartDate(data.startDate.split('T')[0]);
                setEndDate(data.endDate.split('T')[0]);
                setSelectedRecipes(data.recipes);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes');
                const data: Recipe[] = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchMenu();
        fetchRecipes();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedRecipes.length === 0 || !session?.user?.id) {
            setAutocompleteError(true);
            return;
        }

        const menuData = {
            name,
            weekOfYear: parseInt(weekOfYear, 10),
            userId: session.user.id,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            recipes: selectedRecipes.map(item => ({ id: item.id }))
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
                router.push('/menu');
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
                    label="Menu Name"
                    type="text"
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
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Week of Year"
                    type="number"
                    value={weekOfYear}
                    onChange={(e) => setWeekOfYear(e.target.value)}
                    required
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
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
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
                            helperText={autocompleteError ? 'Please select at least one recipe' : ''}
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
