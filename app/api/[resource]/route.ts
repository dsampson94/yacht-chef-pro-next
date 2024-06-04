import { NextResponse } from 'next/server';
import { getModel } from '../../../lib/api';
import { handleErrorResponse } from '../../../lib/errorHandler';
import { validateData } from '../../../lib/validation';

type Params = { params: { resource: string } };

const getModelAndValidate = (resource: string) => {
    const model = getModel(resource);
    if (!model) {
        return { error: NextResponse.json({ error: `Model for resource "${resource}" not found` }, { status: 400 }) };
    }
    return { model };
};

const createSupplierLocations = async (locationId: string, suppliers: Array<{ id: string }>) => {
    const supplierLocationModel = getModel('supplier-locations');
    const createOperations = suppliers.map(supplier =>
        // @ts-ignore
        supplierLocationModel?.create({ data: { supplierId: supplier.id, locationId } })
    );
    return await Promise.all(createOperations);
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

export async function POST(req: Request, { params }: Params) {
    const { resource } = params;
    const data = await req.json();
    const { suppliers, ...resourceData } = data;
    const { model, error } = getModelAndValidate(resource);
    if (error) return error;

    const requiredFields: string[] = [];
    const validation = validateData(resource, resourceData, requiredFields);
    if (validation.error) return validation.error;

    try {
        // @ts-ignore
        const newItem = await model.create({ data: resourceData });
        if (resource === 'locations' && suppliers && suppliers.length > 0) {
            await createSupplierLocations(newItem.id, suppliers);
        }
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return handleErrorResponse(error, resource, 'creating');
    }
}
