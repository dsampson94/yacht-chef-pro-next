'use client';

import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import DateBar from './DateBar';
import { getWeek, getYear } from 'date-fns';

const daysOfWeek = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

const mealSections = [
    { section: 'Breakfast', items: ['Fruit', 'Fruit 2', 'Cereal', 'Breads', 'Yoghurt', 'Juice', 'Pastries', 'Other'] },
    { section: 'Breakfast PAX', items: ['Breakfast PAX'] },
    { section: 'Lunch', items: ['Starter', 'Main', 'Sauce', 'Starch', 'Veg 1', 'Veg 2', 'Breads', 'Dessert', 'Other'] },
    { section: 'Lunch PAX', items: ['Lunch PAX'] },
    { section: 'Dinner', items: ['Starter', 'Main', 'Sauce', 'Starch', 'Veg 1', 'Veg 2', 'Breads', 'Dessert', 'Other'] },
    { section: 'Dinner PAX', items: ['Dinner PAX'] },
    { section: 'Snacks', items: ['Snacks', 'Notes'] },
    { section: 'Stock Checks', items: ['Stock Checks'] },
];

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

    const fetchMenu = async (year: number, weekOfYear: number) => {
        try {
            const response = await fetch(`/api/menu-calendar/${year}/${weekOfYear}`);
            const data = await response.json();
            if (data.error) {
                setCurrentMenu(null);
                setMenu({});
            } else {
                setCurrentMenu(data);
                const newMenu = data.recipes.reduce((acc: any, recipe: any) => {
                    acc[`${recipe.day}-${recipe.meal}`] = recipe.recipeId;
                    return acc;
                }, {});
                setMenu(newMenu);
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    const handleWeekChange = (start: Date, end: Date) => {
        setStartDate(start);
        setEndDate(end);
        const weekOfYear = getWeek(start);
        const year = getYear(start);
        if (userId) {
            fetchMenu(year, weekOfYear);
        }
    };

    const handleRecipeChange = async (day: string, meal: string, recipeId: string) => {
        setMenu((prevMenu) => ({
            ...prevMenu,
            [`${day}-${meal}`]: recipeId,
        }));

        const updatedRecipes = Object.entries(menu).map(([key, value]) => {
            const [day, meal] = key.split('-');
            return { recipeId: value, day, meal };
        });

        if (currentMenu) {
            const updateMenu = async () => {
                try {
                    const response = await fetch(`/api/menu-calendar/${getYear(new Date(currentMenu.startDate))}/${currentMenu.weekOfYear}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ menuId: currentMenu.id, recipes: updatedRecipes }),
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
            <Box overflow="auto">
                <Box display="grid" gridTemplateColumns={`auto repeat(${daysOfWeek.length}, 150px)`} gap={1}>
                    <Box />
                    {daysOfWeek.map((day) => (
                        <Box key={day} textAlign="center">
                            <Typography variant="h6">{day}</Typography>
                        </Box>
                    ))}
                    {mealSections.map((section) => (
                        <React.Fragment key={section.section}>
                            <Box gridColumn={`span ${daysOfWeek.length + 1}`}>
                                <Typography variant="h6">{section.section}</Typography>
                            </Box>
                            {section.items.map((item) => (
                                <React.Fragment key={item}>
                                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                                        <Typography variant="body1">{item}</Typography>
                                    </Box>
                                    {daysOfWeek.map((day) => (
                                        <Box
                                            key={`${day}-${item}`}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            border={1}
                                            borderRadius={1}
                                            height="100%"
                                        >
                                            <Select
                                                value={menu[`${day}-${item}`] || ''}
                                                onChange={(e) => handleRecipeChange(day, item, e.target.value as string)}
                                                fullWidth
                                                sx={{
                                                    maxWidth: 150,
                                                    '& .MuiSelect-select': {
                                                        whiteSpace: 'normal',
                                                    },
                                                }}
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
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default MenuCalendar;
