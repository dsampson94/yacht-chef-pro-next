'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Ingredient {
    id: string;
    name: string;
}

interface User {
    id: string;
    username: string;
}

interface Menu {
    id: string;
    name: string;
    recipes: {
        ingredients: Ingredient[];
    }[];
}

const CreateOrder = () => {
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch('/api/menus');
                const data: Menu[] = await response.json();
                setMenus(data);
            } catch (error) {
                console.error('Error fetching menus:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMenus();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedMenu) {
            const menuIngredients = selectedMenu.recipes.flatMap(recipe => recipe.ingredients);
            setIngredients(menuIngredients);
        } else {
            setIngredients([]);
        }
    }, [selectedMenu]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedMenu || !selectedUser) {
            alert('Please select a menu and a user.');
            return;
        }

        const orderData = {
            userId: selectedUser.id,
            menuId: selectedMenu.id,
            date: new Date(date),
            status,
            orderItems: ingredients.map(ingredient => ({
                ingredientId: ingredient.id,
                quantity: 1, // Default quantity, adjust as needed
                supplierId: 'supplier-id-placeholder', // Replace with actual supplier ID logic
                locationId: 'location-id-placeholder', // Replace with actual location ID logic
            })),
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert('Order created successfully');
                router.push('/orders');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('An error occurred while creating the order.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <Autocomplete
                    options={users}
                    getOptionLabel={(option: User) => option.username}
                    value={selectedUser}
                    onChange={(event, newValue: User | null) => setSelectedUser(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="User" margin="normal" required fullWidth />
                    )}
                />
            </div>
            <div>
                <Autocomplete
                    options={menus}
                    getOptionLabel={(option: Menu) => option.name}
                    value={selectedMenu}
                    onChange={(event, newValue: Menu | null) => setSelectedMenu(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Menu" margin="normal" required fullWidth />
                    )}
                />
            </div>
            {selectedMenu && (
                <div>
                    <h3>Ingredients:</h3>
                    <ul>
                        {ingredients?.map(ingredient => (
                            <li key={ingredient?.id}>{ingredient?.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Button type="submit" variant="contained" color="primary">
                Create Order
            </Button>
        </form>
    );
};

export default CreateOrder;
