import { NextResponse } from 'next/server';
import { getModel } from '../../../../lib/api';
import { handleErrorResponse } from '../../../../lib/errorHandler';

type Params = { params: { resource: string, id: string } };

const getModelAndValidate = (resource: string) => {
    const model = getModel(resource);
    if (!model) {
        return { error: NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 }) };
    }
    return { model };
};

export async function GET(req: Request, { params }: Params) {
    const { resource, id } = params;
    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    try {
        let item;
        if (resource === 'locations') {
            item = await model.findUnique({
                where: { id },
                include: {
                    suppliers: {
                        include: {
                            supplier: true
                        }
                    }
                }
            });
        } else {
            item = await model.findUnique({ where: { id } });
        }
        return NextResponse.json(item);
    } catch (error) {
        return handleErrorResponse(error, resource, 'fetching');
    }
}

export async function PUT(req: Request, { params }: Params) {
    const { resource, id } = params;
    const data = await req.json();
    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    try {
        const item = await model.update({ where: { id }, data });
        return NextResponse.json(item);
    } catch (error) {
        return handleErrorResponse(error, resource, 'updating');
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { resource, id } = params;
    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    try {
        await model.delete({ where: { id } });
        return NextResponse.json({ message: `${resource} deleted` });
    } catch (error) {
        return handleErrorResponse(error, resource, 'deleting');
    }
}
