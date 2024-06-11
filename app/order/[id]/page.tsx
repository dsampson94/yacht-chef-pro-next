'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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

interface OrderItem {
    ingredientId: string;
    supplierId: string;
    locationId: string;
    quantity: number;
}

interface Order {
    id: string;
    userId: string;
    date: string;
    status: string;
    orderItems: OrderItem[];
    menuId: string | null;
}

interface Menu {
    id: string;
    name: string;
    recipes: Recipe[];
}

interface Recipe {
    id: string;
    name: string;
    ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
    ingredient: Ingredient;
}

const statusOptions = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];

const EditOrder: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [date, setDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data: Order = await response.json();
                setDate(new Date(data.date).toISOString().split('T')[0]);
                setStatus(data.status);

                if (data.userId) {
                    const userResponse = await fetch(`/api/users/${data.userId}`);
                    const user: User = await userResponse.json();
                    setSelectedUser(user);
                }

                if (data.menuId) {
                    const menuResponse = await fetch(`/api/menus/${data.menuId}`);
                    const menu: Menu = await menuResponse.json();
                    setSelectedMenu(menu);
                }

                const detailedIngredients = await fetchDetailedIngredients(data.orderItems);
                setIngredients(detailedIngredients);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchDetailedIngredients = async (orderItems: OrderItem[]): Promise<Ingredient[]> => {
            const ingredientPromises = orderItems.map(async (item) => {
                const ingredientResponse = await fetch(`/api/ingredients/${item.ingredientId}`);
                const ingredient: Ingredient = await ingredientResponse.json();
                return ingredient;
            });
            return Promise.all(ingredientPromises);
        };

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

        fetchUsers();
        fetchMenus();
        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (selectedMenu) {
            const fetchIngredients = async () => {
                try {
                    const ingredientPromises = selectedMenu.recipes.flatMap(recipe =>
                        recipe.ingredients.map(ri =>
                            fetch(`/api/ingredients/${ri.ingredient.id}`).then(res => res.json())
                        )
                    );
                    const detailedIngredients = await Promise.all(ingredientPromises);
                    setIngredients(detailedIngredients.filter(ingredient => ingredient !== null));
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

        const orderData = {
            userId: selectedUser?.id,
            date: new Date(date).toISOString(),
            status,
            orderItems: ingredients.map((ingredient) => ({
                ingredientId: ingredient.id,
                supplierId: ingredient.supplierIngredients?.[0]?.supplierId || '',
                locationId: ingredient.supplierIngredients?.[0]?.locationId || '',
                quantity: 1,
            })),
        };

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const updatedOrder: Order = await response.json();
                alert('Order updated successfully');
                router.push('/orders');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('An error occurred while updating the order.');
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
                    onChange={(event, newValue) => setStatus(newValue || '')}
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
                    onChange={(event, newValue) => setSelectedUser(newValue)}
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
                    onChange={(event, newValue) => setSelectedMenu(newValue)}
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
                                        <TableCell>{ingredient.supplierIngredients?.[0]?.supplier?.name || 'N/A'}</TableCell>
                                        <TableCell>{ingredient.supplierIngredients?.[0]?.supplier?.email || 'N/A'}</TableCell>
                                        <TableCell>{ingredient.supplierIngredients?.[0]?.supplier?.phone || 'N/A'}</TableCell>
                                        <TableCell>
                                            {ingredient.supplierIngredients?.[0]?.location
                                                ? `${ingredient.supplierIngredients[0].location.city}, ${ingredient.supplierIngredients[0].location.country}`
                                                : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            <Button type="submit" variant="contained" color="primary">
                Update Order
            </Button>
        </form>
    );
};

export default EditOrder;
