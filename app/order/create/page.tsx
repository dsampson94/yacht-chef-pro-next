'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Ingredient {
    id: string;
    name: string;
    weight: number;
    price: number;
    supplierIngredients: SupplierIngredient[];
}

interface SupplierIngredient {
    supplierId: string;
    locationId: string;
    supplier: Supplier;
    location: Location;
}

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Location {
    id: string;
    city: string;
    country: string;
}

interface User {
    id: string;
    username: string;
}

interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
}

interface Menu {
    id: string;
    name: string;
    recipes: Recipe[];
}

const statusOptions = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

const CreateOrder = () => {
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('PENDING');
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
                console.log('Fetched menus:', data);
            } catch (error) {
                console.error('Error fetching menus:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data: User[] = await response.json();
                setUsers(data);
                console.log('Fetched users:', data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMenus();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedMenu) {
            const fetchIngredients = async () => {
                try {
                    const ingredientPromises = selectedMenu.recipes.map(recipe =>
                        fetch(`/api/recipes/${recipe.id}`).then(res => res.json())
                    );
                    const recipeIngredients = await Promise.all(ingredientPromises);
                    const allIngredients = recipeIngredients.flatMap(recipe => recipe.ingredients);
                    const detailedIngredients = await Promise.all(
                        allIngredients.map(ingredient =>
                            fetch(`/api/ingredients/${ingredient.id}`).then(res => res.json())
                        )
                    );
                    setIngredients(detailedIngredients);
                    console.log('Fetched ingredients:', detailedIngredients);
                } catch (error) {
                    console.error('Error fetching ingredients:', error);
                }
            };
            fetchIngredients();
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
            date: new Date(date).toISOString(),
            status,
            orderItems: ingredients.map(ingredient => ({
                ingredientId: ingredient.id,
                quantity: 1,
                supplierId: ingredient.supplierIngredients[0]?.supplierId,
                locationId: ingredient.supplierIngredients[0]?.locationId,
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
                router.push('/order');
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
                <Autocomplete
                    options={statusOptions}
                    getOptionLabel={(option) => option}
                    value={status}
                    onChange={(event, newValue) => setStatus(newValue || 'PENDING')}
                    renderInput={(params) => (
                        <TextField {...params} label="Status" margin="normal" required fullWidth />
                    )}
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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ingredient Name</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Supplier Name</TableCell>
                                    <TableCell>Supplier Email</TableCell>
                                    <TableCell>Supplier Phone</TableCell>
                                    <TableCell>Supplier Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ingredients.map((ingredient) => (
                                    <TableRow key={ingredient.id}>
                                        <TableCell>{ingredient.name}</TableCell>
                                        <TableCell>{ingredient.weight}</TableCell>
                                        <TableCell>{ingredient.price}</TableCell>
                                        <TableCell>{ingredient.supplierIngredients[0]?.supplier.name}</TableCell>
                                        <TableCell>{ingredient.supplierIngredients[0]?.supplier.email}</TableCell>
                                        <TableCell>{ingredient.supplierIngredients[0]?.supplier.phone}</TableCell>
                                        <TableCell>
                                            {ingredient.supplierIngredients[0]?.location.city}, {ingredient.supplierIngredients[0]?.location.country}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <Button type="submit" variant="contained" color="primary">
                Create Order
            </Button>
        </form>
    );
};

export default CreateOrder;
