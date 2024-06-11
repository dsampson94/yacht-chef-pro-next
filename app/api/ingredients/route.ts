// pages/api/ingredients/index.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const RESOURCE_NAME = 'ingredients';
const model = prisma.ingredient;

export async function GET() {
    try {
        const items = await model.findMany({
            include: {
                supplierIngredients: {
                    include: { supplier: true, location: true }
                },
                recipes: {
                    include: { recipe: true }
                }
            }
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();
    const { suppliers = [], recipes = [] } = data;

    try {
        const newItem = await model.create({
            data: {
                name: data.name,
                description: data.description,
                weight: data.weight,
                price: data.price,
                supplierIngredients: {
                    create: suppliers.map((supplier: { id: string, locationId: string }) => ({
                        supplier: { connect: { id: supplier.id } },
                        location: { connect: { id: supplier.locationId } }
                    })),
                },
                recipes: {
                    create: recipes.map((recipe: { id: string }) => ({
                        recipe: { connect: { id: recipe.id } }
                    })),
                }
            }
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
