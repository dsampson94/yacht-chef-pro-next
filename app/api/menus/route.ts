import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const RESOURCE_NAME = 'menus';
const model = prisma.menu;

export async function GET() {
    try {
        const items = await model.findMany({
            include: {
                recipes: true,
                user: { select: { id: true, username: true } }
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

    if (!data.recipes || !Array.isArray(data.recipes)) {
        return NextResponse.json({ error: 'Invalid recipes data' }, { status: 400 });
    }

    const menuData = {
        name: data.name,
        description: data.description,
        weekOfYear: parseInt(data.weekOfYear, 10),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        userId: data.userId,
        recipes: {
            connect: data.recipes.map((item: { id: string }) => ({ id: item.id }))
        }
    };

    try {
        const newItem = await model.create({
            data: menuData,
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating menu: ${error.message}`);
        return NextResponse.json({ error: 'Error creating menu' }, { status: 500 });
    }
}
