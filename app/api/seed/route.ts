import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
    const passwordHash = await bcrypt.hash('password123', 10);

    try {
        // // Clear existing data
        // await prisma.menuRecipe.deleteMany();
        // await prisma.menu.deleteMany();
        // await prisma.recipeIngredient.deleteMany();
        // await prisma.recipe.deleteMany();
        // await prisma.ingredient.deleteMany();
        // await prisma.supplier.deleteMany();
        // await prisma.location.deleteMany();
        // await prisma.user.deleteMany();

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

        // Seed menus
        await prisma.menu.createMany({
            data: [
                { id: 'menu1', userId: 'user2', name: 'Menu 1', weekOfYear: 1, startDate: new Date(), endDate: new Date(), description: 'Menu for Week 1' },
                { id: 'menu2', userId: 'user2', name: 'Menu 2', weekOfYear: 2, startDate: new Date(), endDate: new Date(), description: 'Menu for Week 2' },
                { id: 'menu3', userId: 'user2', name: 'Menu 3', weekOfYear: 3, startDate: new Date(), endDate: new Date(), description: 'Menu for Week 3' },
            ],
        });

        // Seed menu recipes
        await prisma.menuRecipe.createMany({
            data: [
                { id: 'menuRecipe1', menuId: 'menu1', recipeId: 'recipe1', day: 'Monday', meal: 'Breakfast' },
                { id: 'menuRecipe2', menuId: 'menu1', recipeId: 'recipe2', day: 'Tuesday', meal: 'Lunch' },
                { id: 'menuRecipe3', menuId: 'menu1', recipeId: 'recipe3', day: 'Wednesday', meal: 'Dinner' },
                { id: 'menuRecipe4', menuId: 'menu2', recipeId: 'recipe1', day: 'Thursday', meal: 'Snack' },
                { id: 'menuRecipe5', menuId: 'menu2', recipeId: 'recipe2', day: 'Friday', meal: 'Breakfast' },
                { id: 'menuRecipe6', menuId: 'menu2', recipeId: 'recipe3', day: 'Saturday', meal: 'Lunch' },
                { id: 'menuRecipe7', menuId: 'menu3', recipeId: 'recipe1', day: 'Sunday', meal: 'Dinner' },
                { id: 'menuRecipe8', menuId: 'menu3', recipeId: 'recipe2', day: 'Monday', meal: 'Snack' },
                { id: 'menuRecipe9', menuId: 'menu3', recipeId: 'recipe3', day: 'Tuesday', meal: 'Breakfast' },
            ],
        });

        return NextResponse.json({ message: 'Seeding completed successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error seeding data' }, { status: 500 });
    }
}
