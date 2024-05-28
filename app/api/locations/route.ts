import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
    try {
        const locations = await prisma.location.findMany();
        return NextResponse.json(locations);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { city, country } = await req.json();

    if (!city || !country) {
        return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
    }

    try {
        const existingLocation = await prisma.location.findUnique({
            where: { city_country: { city, country } },
        });

        if (existingLocation) {
            return NextResponse.json({ error: 'Location already exists' }, { status: 409 });
        }

        const location = await prisma.location.create({
            data: { city, country },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating location' }, { status: 500 });
    }
}
