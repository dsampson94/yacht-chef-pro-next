'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Recipe {
    id: string;
    name: string;
}

const CreateMenu = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [name, setName] = useState('');
    const [weekOfYear, setWeekOfYear] = useState('');
    const [description, setDescription] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
    const [autocompleteError, setAutocompleteError] = useState(false);

    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1); // Start of the week (Monday)
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7); // End of the week (Sunday)

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

        setWeekOfYear(weekNumber.toString());
        setName(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // @ts-ignore
        if (selectedRecipes.length === 0 || !session?.user?.id) {
            setAutocompleteError(true);
            return;
        }

        const menuData = {
            name,
            weekOfYear: parseInt(weekOfYear, 10),
            // @ts-ignore
            userId: session.user.id,
            description,
            startDate,
            endDate,
            recipes: selectedRecipes.map(item => ({ id: item.id })),
        };

        try {
            const response = await fetch('/api/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData),
            });

            if (response.ok) {
                alert('Menu created successfully');
                router.push('/menu');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating menu:', error);
            alert('An error occurred while creating the menu.');
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
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                Create Menu
            </Button>
        </form>
    );
};

export default CreateMenu;
