'use client';

import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import DateBar from './DateBar';
import { formatISO, getWeek } from 'date-fns';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

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
    recipes: { id: string; day: string; meal: string; recipeId: string; recipe: Recipe }[];
}

const MenuCalendar = () => {
    const { data: session } = useSession();
    const [menu, setMenu] = useState<{ [key: string]: string }>({});
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            // @ts-ignore
            setUserId(session.user.id);
        }
    }, [session]);

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

    const fetchMenu = async (weekOfYear: number) => {
        try {
            const response = await fetch(`/api/menus?weekOfYear=${weekOfYear}&userId=${userId}`);
            const data = await response.json();
            if (data.id) {
                setCurrentMenu(data);
                const newMenu = data.recipes.reduce((acc: any, recipe: any) => {
                    acc[`${recipe.day}-${recipe.meal}`] = recipe.recipeId;
                    return acc;
                }, {});
                setMenu(newMenu);
            } else {
                setCurrentMenu(null);
                setMenu({});
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    const handleWeekChange = (start: Date, end: Date) => {
        setStartDate(start);
        setEndDate(end);
        const weekOfYear = getWeek(start);
        if (userId) {
            fetchMenu(weekOfYear);
        }
    };

    const handleRecipeChange = (day: string, meal: string, recipeId: string) => {
        setMenu((prevMenu) => ({
            ...prevMenu,
            [`${day}-${meal}`]: recipeId,
        }));

        const updatedRecipes = Object.entries(menu).map(([key, value]) => {
            const [day, meal] = key.split('-');
            return { day, meal, recipeId: value };
        });

        if (currentMenu) {
            const updateMenu = async () => {
                try {
                    const response = await fetch(`/api/menus/${currentMenu.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ recipes: updatedRecipes }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update menu');
                    }
                } catch (error) {
                    console.error('Error updating menu:', error);
                }
            };

            updateMenu();
        }
    };

    return (
        <Box>
            <DateBar onWeekChange={handleWeekChange} />
            <Typography variant="h4" gutterBottom>
                Weekly Menu Planner
            </Typography>
            <Box display="grid" gridTemplateColumns={`repeat(${mealTimes.length + 1}, 1fr)`} gap={2}>
                <Box />
                {mealTimes.map((meal) => (
                    <Box key={meal}>
                        <Typography variant="h6">{meal}</Typography>
                    </Box>
                ))}
                {daysOfWeek.map((day) => (
                    <React.Fragment key={day}>
                        <Box>
                            <Typography variant="h6">{day}</Typography>
                        </Box>
                        {mealTimes.map((meal) => (
                            <Box key={`${day}-${meal}`} border={1} padding={1}>
                                <Select
                                    value={menu[`${day}-${meal}`] || ''}
                                    onChange={(e) => handleRecipeChange(day, meal, e.target.value as string)}
                                    fullWidth
                                >
                                    {recipes.map((recipe) => (
                                        <MenuItem key={recipe.id} value={recipe.id}>
                                            {recipe.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        ))}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};

export default MenuCalendar;
