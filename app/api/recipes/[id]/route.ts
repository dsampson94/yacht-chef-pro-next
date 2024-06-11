import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

const RESOURCE_NAME = 'recipes';
const model = prisma.recipe;

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const item = await model.findUnique({
            where: { id },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
        if (!item) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    const { id } = params;
    const data = await req.json();

    try {
        const updatedItem = await model.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                ingredients: {
                    set: data.ingredients.map((ingredient: { id: string }) => ({
                        ingredient: { connect: { id: ingredient.id } },
                    })),
                },
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error(`Error updating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error updating ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;

    try {
        await model.delete({ where: { id } });
        return NextResponse.json({ message: `${RESOURCE_NAME.slice(0, -1)} deleted` });
    } catch (error) {
        console.error(`Error deleting ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error deleting ${RESOURCE_NAME}` }, { status: 500 });
    }
}
