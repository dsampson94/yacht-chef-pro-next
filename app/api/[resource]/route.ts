import { NextResponse } from 'next/server';
import { getModel } from '../../../lib/api';

type Params = { params: { resource: string } };

const handleErrorResponse = (error: Error, resource: string, action: string) => {
    console.error(`Error ${action} ${resource}:`, error.message);
    return NextResponse.json({ error: `Error ${action} ${resource}` }, { status: 500 });
};

const getModelAndValidate = (resource: string) => {
    const model = getModel(resource);
    if (!model) {
        return { error: NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 }) };
    }
    return { model };
};

const validateData = (data: any, requiredFields?: string[]) => {
    if (requiredFields) {
        for (const field of requiredFields) {
            if (!data[field]) {
                return { error: NextResponse.json({ error: `${field} is required` }, { status: 400 }) };
            }
        }
    }
    return { isValid: true };
};

export async function GET(req: Request, { params }: Params) {
    const { resource } = params;
    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    try {
        // @ts-ignore
        const items = await model.findMany();
        return NextResponse.json(items);
    } catch (error) {
        return handleErrorResponse(error, resource, 'fetching');
    }
}

export async function POST(req: Request, { params }: Params, requiredFields?: string[]) {
    const { resource } = params;
    const data = await req.json();

    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    const validation = validateData(data, requiredFields);
    if (validation.error) return validation.error;

    try {
        // @ts-ignore
        const item = await model.create({ data });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return handleErrorResponse(error, resource, 'creating');
    }
}
