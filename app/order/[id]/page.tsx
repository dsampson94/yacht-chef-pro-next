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
    id: string;
    supplierId: string;
    ingredientId: string;
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
    id: string;
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
}

const EditOrder = () => {
    const { id } = useParams();
    const router = useRouter();
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                const data: Order = await response.json();
                setDate(new Date(data.date).toISOString().split('T')[0]);
                setStatus(data.status);
                const detailedIngredients = await fetchDetailedIngredients(data.orderItems);
                setSelectedIngredients(detailedIngredients);
                setSelectedUser(users.find(user => user.id === data.userId) || null);
                setQuantity(data.orderItems[0]?.quantity || 0); // Assuming all items have the same quantity
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchDetailedIngredients = async (orderItems: OrderItem[]) => {
            const ingredientPromises = orderItems.map(async item => {
                const ingredientResponse = await fetch(`/api/ingredients/${item.ingredientId}`);
                const ingredient: Ingredient = await ingredientResponse.json();
                return ingredient;
            });
            return Promise.all(ingredientPromises);
        };

        const fetchIngredients = async () => {
            try {
                const response = await fetch('/api/ingredients');
                const data: Ingredient[] = await response.json();
                setIngredients(data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        const fetchSuppliers = async () => {
            try {
                const response = await fetch('/api/suppliers');
                const data: Supplier[] = await response.json();
                setSuppliers(data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                const data: Location[] = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
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

        fetchOrder();
        fetchIngredients();
        fetchSuppliers();
        fetchLocations();
        fetchUsers();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const orderData = {
            userId: selectedUser?.id,
            date: new Date(date),
            status,
            orderItems: selectedIngredients.map((ingredient, index) => ({
                ingredientId: ingredient.id,
                supplierId: selectedSuppliers[index]?.id,
                locationId: selectedLocations[index]?.id,
                quantity,
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
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    required
                    fullWidth
                    margin="normal"
                />
            </div>
            <Button type="submit" variant="contained" color="primary">
                Update Order
            </Button>

            {selectedIngredients.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                            {selectedIngredients.map((ingredient) => (
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
            )}
        </form>
    );
};

export default EditOrder;
