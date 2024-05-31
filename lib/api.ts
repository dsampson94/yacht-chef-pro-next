import prisma from '../lib/prisma';

export const getModel = (resource: string) => {
    switch (resource) {
        case 'users':
            return prisma.user;
        case 'accounts':
            return prisma.account;
        case 'sessions':
            return prisma.session;
        case 'chefs':
            return prisma.chef;
        case 'menus':
            return prisma.menu;
        case 'menu-items':
            return prisma.menuItem;
        case 'ingredients':
            return prisma.ingredient;
        case 'suppliers':
            return prisma.supplier;
        case 'locations':
            return prisma.location;
        case 'supplier-locations':
            return prisma.supplierLocation;
        case 'supplier-ingredients':
            return prisma.supplierIngredient;
        case 'orders':
            return prisma.order;
        case 'order-items':
            return prisma.orderItem;
        case 'reviews':
            return prisma.review;
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
