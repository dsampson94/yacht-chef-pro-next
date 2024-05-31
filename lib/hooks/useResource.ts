import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ENDPOINTS } from '../constants';
import { apiRequest } from '../api';

interface ResourceItem {
    id: number;
    [key: string]: any;
}

export const useResource = (resource: string) => {
    const { data: session } = useSession();
    const [items, setItems] = useState<ResourceItem[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (session) {
            apiRequest(ENDPOINTS[resource])
                .then(data => setItems(data))
                .catch(error => setError(error.message));
        }
    }, [session, resource]);

    const deleteItem = async (id: number) => {
        try {
            await apiRequest(`${ENDPOINTS[resource]}/${id}`, 'DELETE');
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const createItem = async (data: any) => {
        try {
            const newItem = await apiRequest(ENDPOINTS[resource], 'POST', undefined, data);
            setItems([...items, newItem]);
        } catch (error) {
            setError(error.message);
        }
    };

    const updateItem = async (id: number, data: any) => {
        try {
            const updatedItem = await apiRequest(`${ENDPOINTS[resource]}/${id}`, 'PUT', undefined, data);
            setItems(items.map(item => (item.id === id ? updatedItem : item)));
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchItem = async (id: number) => {
        try {
            return await apiRequest(`${ENDPOINTS[resource]}/${id}`, 'GET');
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    return { items, error, deleteItem, createItem, updateItem, fetchItem, setError, setItems };
};
