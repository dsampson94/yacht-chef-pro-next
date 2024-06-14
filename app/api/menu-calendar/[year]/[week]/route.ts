import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { year: string, week: string } }) {
    const { year, week } = params;
    const weekOfYear = parseInt(week, 10);

    try {
        const menu = await prisma.menu.findFirst({
            where: {
                weekOfYear,
                startDate: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31`),
                },
            },
            include: {
                recipes: {
                    include: {
                        recipe: true
                    }
                },
                user: { select: { id: true, username: true } }
            }
        });

        if (!menu) {
            return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json(menu);
    } catch (error) {
        console.error(`Error fetching menus: ${error.message}`);
        return NextResponse.json({ error: `Error fetching menus` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    if (!data.recipes || !Array.isArray(data.recipes)) {
        return NextResponse.json({ error: 'Invalid recipes data' }, { status: 400 });
    }

    try {
        const updatedMenu = await prisma.menu.update({
            where: { id: data.menuId },
            data: {
                recipes: {
                    deleteMany: {}, // Delete existing records to allow updating
                    create: data.recipes.map((item: { recipeId: string, day: string, meal: string }) => ({
                        recipeId: item.recipeId,
                        day: item.day,
                        meal: item.meal,
                    }))
                }
            }
        });
        return NextResponse.json(updatedMenu);
    } catch (error) {
        console.error(`Error updating menu: ${error.message}`);
        return NextResponse.json({ error: `Error updating menu` }, { status: 500 });
    }
}
