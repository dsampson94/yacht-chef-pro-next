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
    const { suppliers, ...locationData } = data;

    try {
        console.log('Location Data:', locationData);
        console.log('Suppliers:', suppliers);

        // Create the new location
        const newItem = await model.create({
            data: locationData,
        });

        console.log('New Location Created:', newItem);

        // If suppliers are provided, create entries in the SupplierLocation table
        if (suppliers && suppliers.length > 0) {
            await Promise.all(
                suppliers.map((supplierId: string) => {
                    console.log(`Creating supplierLocation for supplierId: ${supplierId} and locationId: ${newItem.id}`);
                    return prisma.supplierLocation.create({
                        data: {
                            supplierId,
                            locationId: newItem.id,
                        },
                    });
                })
            );
        }

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
