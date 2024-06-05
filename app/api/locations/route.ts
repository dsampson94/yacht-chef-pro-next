import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const RESOURCE_NAME = 'locations';
const model = prisma.location;

export async function GET() {
    try {
        const items = await model.findMany({
            include: {
                suppliers: {
                    include: {
                        supplier: true
                    }
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

    try {
        const { suppliers, ...locationData } = data;
        const newItem = await model.create({
            data: {
                ...locationData,
                suppliers: {
                    create: suppliers.map((supplierId: string) => ({
                        supplier: {
                            connect: { id: supplierId }
                        }
                    }))
                }
            }
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
