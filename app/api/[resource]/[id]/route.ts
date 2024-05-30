import { NextResponse } from 'next/server';
import console from 'console';
import { getModel } from '../../../../lib/api';

export async function GET(req: Request, { params }: { params: { resource: string, id: string } }) {
    const { resource, id } = params;

    const model = getModel(resource);

    if (!model) {
        return NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 });
    }

    try {
        const item = await model.findUnique({
            where: { id: id },
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error fetching ${resource}` }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { resource: string, id: string } }) {
    const { resource, id } = params;
    const data = await req.json();

    const model = getModel(resource);

    if (!model) {
        return NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 });
    }

    try {
        const item = await model.update({
            where: { id: id },
            data,
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error updating ${resource}` }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { resource: string, id: string } }) {
    const { resource, id } = params;

    const model = getModel(resource);

    if (!model) {
        return NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 });
    }

    try {
        await model.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: `${resource} deleted` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error deleting ${resource}` }, { status: 500 });
    }
}
