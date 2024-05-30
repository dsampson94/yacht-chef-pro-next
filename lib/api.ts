import prisma from '../lib/prisma';

export const getModel = (resource: string) => {
    switch (resource) {
        case 'locations':
            return prisma.location;
        default:
            return null;
    }
};

export const apiRequest = async (
    resource: string,
    method: string = 'GET',
    id?: string | number,
    data?: object
) => {
    const url = id ? `/api/${resource}/${id}` : `/api/${resource}`;
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
    }
    return response.json();
};
