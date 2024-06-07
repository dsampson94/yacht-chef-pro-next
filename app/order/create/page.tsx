'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Autocomplete } from '@mui/material';

interface Ingredient {
    id: string;
    name: string;
}

interface Supplier {
    id: string;
    name: string;
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

const CreateOrder = () => {
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
    const router = useRouter();

    useEffect(() => {
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

        fetchIngredients();
        fetchSuppliers();
        fetchLocations();
        fetchUsers();
    }, []);

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
                    multiple
                    options={ingredients}
                    getOptionLabel={(option: Ingredient) => option.name}
                    value={selectedIngredients}
                    onChange={(event, newValue: Ingredient[]) => setSelectedIngredients(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Ingredients" margin="normal" required fullWidth />
                    )}
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={suppliers}
                    getOptionLabel={(option: Supplier) => option.name}
                    value={selectedSuppliers}
                    onChange={(event, newValue: Supplier[]) => setSelectedSuppliers(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Suppliers" margin="normal" required fullWidth />
                    )}
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={locations}
                    getOptionLabel={(option: Location) => `${option.city}, ${option.country}`}
                    value={selectedLocations}
                    onChange={(event, newValue: Location[]) => setSelectedLocations(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Locations" margin="normal" required fullWidth />
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
                Create Order
            </Button>
        </form>
    );
};

export default CreateOrder;
