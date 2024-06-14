import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { addWeeks, startOfYear, formatISO } from 'date-fns';

export async function POST(req: Request) {
    const passwordHash = await bcrypt.hash('password123', 10);

    try {
        // Clear existing data
        await prisma.menuRecipe.deleteMany();
        await prisma.menu.deleteMany();
        await prisma.recipeIngredient.deleteMany();
        await prisma.recipe.deleteMany();
        await prisma.ingredient.deleteMany();
        await prisma.supplier.deleteMany();
        await prisma.location.deleteMany();
        await prisma.user.deleteMany();

        // Seed users
        await prisma.user.createMany({
            data: [
                {
                    id: 'user1',
                    email: 'admin@example.com',
                    username: 'admin',
                    password: passwordHash,
                    role: 'ADMIN',
                },
                {
                    id: 'user2',
                    email: 'chef@example.com',
                    username: 'chef',
                    password: passwordHash,
                    role: 'CHEF',
                },
                {
                    id: 'user3',
                    email: 'user@example.com',
                    username: 'user',
                    password: passwordHash,
                    role: 'USER',
                },
            ],
        });

        // Seed locations
        await prisma.location.createMany({
            data: [
                { id: 'location1', city: 'New York', country: 'USA' },
                { id: 'location2', city: 'Los Angeles', country: 'USA' },
                { id: 'location3', city: 'London', country: 'UK' },
            ],
        });

        // Seed suppliers
        await prisma.supplier.createMany({
            data: [
                {
                    id: 'supplier1',
                    name: 'Supplier 1',
                    email: 'supplier1@example.com',
                    phone: '123456789',
                    locationId: 'location1',
                },
                {
                    id: 'supplier2',
                    name: 'Supplier 2',
                    email: 'supplier2@example.com',
                    phone: '987654321',
                    locationId: 'location2',
                },
                {
                    id: 'supplier3',
                    name: 'Supplier 3',
                    email: 'supplier3@example.com',
                    phone: '111222333',
                    locationId: 'location3',
                },
            ],
        });

        // Seed ingredients
        await prisma.ingredient.createMany({
            data: [
                { id: 'ingredient1', name: 'Tomato', description: 'Fresh tomato', weight: 1, price: 1.5 },
                { id: 'ingredient2', name: 'Lettuce', description: 'Crisp lettuce', weight: 0.5, price: 1.0 },
                { id: 'ingredient3', name: 'Cucumber', description: 'Fresh cucumber', weight: 0.8, price: 1.2 },
            ],
        });

        // Seed recipes
        await prisma.recipe.createMany({
            data: [
                { id: 'recipe1', name: 'Tomato Salad', description: 'Salad with fresh tomatoes' },
                { id: 'recipe2', name: 'Lettuce Wrap', description: 'Wrap with fresh lettuce' },
                { id: 'recipe3', name: 'Cucumber Salad', description: 'Salad with fresh cucumbers' },
            ],
        });

        // Seed recipe ingredients
        await prisma.recipeIngredient.createMany({
            data: [
                { recipeId: 'recipe1', ingredientId: 'ingredient1' },
                { recipeId: 'recipe2', ingredientId: 'ingredient2' },
                { recipeId: 'recipe3', ingredientId: 'ingredient3' },
            ],
        });

        // Seed menus for the current year and the next two years
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1, currentYear + 2];

        for (const year of years) {
            let startDate = startOfYear(new Date(year, 0, 1));
            for (let week = 1; week <= 52; week++) {
                const endDate = addWeeks(startDate, 1);
                await prisma.menu.create({
                    data: {
                        userId: 'user2', // Assuming 'chef' user
                        name: `Menu ${week} of ${year}`,
                        weekOfYear: week,
                        startDate: formatISO(startDate),
                        endDate: formatISO(endDate),
                        description: `Menu for Week ${week} of ${year}`
                    }
                });
                startDate = endDate;
            }
        }

        return NextResponse.json({ message: 'Seeding completed successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error seeding data' }, { status: 500 });
    }
}
