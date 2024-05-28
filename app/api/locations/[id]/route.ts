import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const location = await prisma.location.findUnique({
            where: { id: Number(id) },
        });
        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching location' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { city, country } = await req.json();

    if (!city || !country) {
        return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
    }

    try {
        const location = await prisma.location.update({
            where: { id: Number(id) },
            data: { city, country },
        });
        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating location' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.location.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Location deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting location' }, { status: 500 });
    }
}
