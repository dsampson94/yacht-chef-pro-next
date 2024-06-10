'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

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

interface Menu {
    id: string;
    name: string;
    recipes: {
        ingredients: Ingredient[];
    }[];
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
    menuId: string;
    date: string;
    status: string;
    orderItems: OrderItem[];
}

const EditOrder = () => {
    const { id } = useParams();
    const router = useRouter();
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
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
                setSelectedUser(users.find(user => user.id === data.userId) || null);
                setSelectedMenu(menus.find(menu => menu.id === data.menuId) || null);
                setSelectedIngredients(data.orderItems.map(item => ingredients.find(ingredient => ingredient.id === item.ingredientId) || { id: item.ingredientId, name: '' }));
                setSelectedSuppliers(data.orderItems.map(item => suppliers.find(supplier => supplier.id === item.supplierId) || { id: item.supplierId, name: '' }));
                setSelectedLocations(data.orderItems.map(item => locations.find(location => location.id === item.locationId) || { id: item.locationId, city: '', country: '' }));
                setQuantity(data.orderItems[0]?.quantity || 0); // Assuming all items have the same quantity
            } catch (error) {
                console.error('Error fetching order:', error);
            }
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
        fetchMenus();
        fetchIngredients();
        fetchSuppliers();
        fetchLocations();
        fetchUsers();
    }, [id]);

    useEffect(() => {
        if (selectedMenu) {
            const menuIngredients = selectedMenu.recipes.flatMap(recipe => recipe.ingredients);
            setSelectedIngredients(menuIngredients);
        } else {
            setSelectedIngredients([]);
        }
    }, [selectedMenu]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const orderData = {
            userId: selectedUser?.id,
            menuId: selectedMenu?.id,
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
                <>
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
                </>
            )}
            <Button type="submit" variant="contained" color="primary">
                Update Order
            </Button>
        </form>
    );
};

export default EditOrder;
