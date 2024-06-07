import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Seed users
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await prisma.user.createMany({
        data: [
            {
                email: 'admin@example.com',
                username: 'admin',
                password: passwordHash,
                role: 'ADMIN',
            },
            {
                email: 'chef@example.com',
                username: 'chef',
                password: passwordHash,
                role: 'CHEF',
            },
            {
                email: 'user@example.com',
                username: 'user',
                password: passwordHash,
                role: 'USER',
            },
        ],
    });

    // Seed locations
    const locations = await prisma.location.createMany({
        data: [
            { city: 'New York', country: 'USA' },
            { city: 'Los Angeles', country: 'USA' },
            { city: 'London', country: 'UK' },
        ],
    });

    // Seed suppliers
    const suppliers = await prisma.supplier.createMany({
        data: [
            {
                name: 'Supplier 1',
                email: 'supplier1@example.com',
                phone: '123456789',
                locationId: 1, // Assuming locationId starts from 1
            },
            {
                name: 'Supplier 2',
                email: 'supplier2@example.com',
                phone: '987654321',
                locationId: 2,
            },
        ],
    });

    // Seed ingredients
    const ingredients = await prisma.ingredient.createMany({
        data: [
            { name: 'Tomato', description: 'Fresh tomato', weight: 1, price: 1.5 },
            { name: 'Lettuce', description: 'Crisp lettuce', weight: 0.5, price: 1.0 },
        ],
    });

    // Seed menu items
    const menuItems = await prisma.menuItem.createMany({
        data: [
            { name: 'Tomato Salad', description: 'Salad with fresh tomatoes', ingredients: { connect: [{ id: 1 }] } },
            { name: 'Lettuce Wrap', description: 'Wrap with fresh lettuce', ingredients: { connect: [{ id: 2 }] } },
        ],
    });

    // Seed menus
    const menus = await prisma.menu.createMany({
        data: [
            { chefId: 1, weekOfYear: 1, menuItems: { connect: [{ id: 1 }, { id: 2 }] } },
        ],
    });

    console.log({ users, locations, suppliers, ingredients, menuItems, menus });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
