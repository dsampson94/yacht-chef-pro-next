import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const RESOURCE_NAME = 'suppliers';
const model = prisma.supplier;

export async function GET() {
    try {
        const items = await model.findMany({
            include: { location: true }
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    if (!data.locationId) {
        return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    try {
        const newItem = await model.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                locationId: data.locationId
            }
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
