'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

interface MenuItem {
    id: string;
    name: string;
}

interface Chef {
    id: string;
    username: string;
}

interface Menu {
    id: string;
    weekOfYear: number;
    menuItems: MenuItem[];
    user: Chef;
}

const EditMenu = () => {
    const router = useRouter();
    const { id } = useParams();
    const [weekOfYear, setWeekOfYear] = useState('');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState<MenuItem[]>([]);
    const [chefs, setChefs] = useState<Chef[]>([]);
    const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
    const [autocompleteError, setAutocompleteError] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`/api/menus/${id}`);
                const data: Menu = await response.json();
                setWeekOfYear(data.weekOfYear.toString());
                setSelectedMenuItems(data.menuItems);
                setSelectedChef(data.user);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menu-items');
                const data: MenuItem[] = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        const fetchChefs = async () => {
            try {
                const response = await fetch('/api/chefs');
                const data: Chef[] = await response.json();
                setChefs(data);
            } catch (error) {
                console.error('Error fetching chefs:', error);
            }
        };

        fetchMenu();
        fetchMenuItems();
        fetchChefs();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedMenuItems.length === 0 || !selectedChef) {
            setAutocompleteError(true);
            return;
        }

        const menuData = {
            weekOfYear: parseInt(weekOfYear, 10),
            userId: selectedChef.id,
            menuItems: selectedMenuItems.map(item => ({ id: item.id }))
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
                router.push('/menu'); // Redirect to the menus list page
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
                <Autocomplete
                    multiple
                    options={menuItems}
                    getOptionLabel={(option: MenuItem) => option.name}
                    value={selectedMenuItems}
                    onChange={(event, newValue: MenuItem[]) => {
                        setSelectedMenuItems(newValue);
                        if (newValue.length > 0) setAutocompleteError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Menu Items"
                            margin="normal"
                            fullWidth
                            error={autocompleteError}
                            helperText={autocompleteError ? "Please select at least one menu item and a chef" : ""}
                        />
                    )}
                />
            </div>
            <div>
                <Autocomplete
                    options={chefs}
                    getOptionLabel={(option: Chef) => option.username}
                    value={selectedChef}
                    onChange={(event, newValue: Chef | null) => setSelectedChef(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chef"
                            margin="normal"
                            fullWidth
                            error={autocompleteError}
                            helperText={autocompleteError ? "Please select a chef" : ""}
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
