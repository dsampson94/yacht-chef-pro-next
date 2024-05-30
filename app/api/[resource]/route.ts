import { NextResponse } from 'next/server';
import { getModel } from '../../../lib/api';

export async function GET(req: Request, { params }: { params: { resource: string } }) {
    const { resource } = params;

    const model = getModel(resource);

    if (!model) {
        return NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 });
    }

    try {
        const items = await model.findMany();
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching items:', error.message);
        return NextResponse.json({ error: `Error fetching ${resource}` }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { resource: string } }) {
    const { resource } = params;
    const data = await req.json();

    console.log('Received data:', data);

    const model = getModel(resource);

    if (!model) {
        console.error(`Model for resource "${resource}" not found`);
        return NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 });
    }

    if (!data.city || !data.country) {
        console.error('Validation error: city and country are required');
        return NextResponse.json({ error: 'City and country are required' }, { status: 400 });
    }

    try {
        const item = await model.create({ data });
        console.log('Created item:', item);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error creating item:', error.message);
        return NextResponse.json({ error: `Error creating ${resource}: ${error.message}` }, { status: 500 });
    }
}
