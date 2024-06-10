import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { generatePdf } from '../../../lib/pdf';

const RESOURCE_NAME = 'orders';
const model = prisma.order;

export async function GET() {
    try {
        const items = await model.findMany({
            include: {
                orderItems: {
                    include: {
                        ingredient: true,
                        supplier: true,
                        location: true,
                    },
                },
                user: true,
            },
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    const orderData = {
        userId: data.userId,
        date: new Date(data.date),
        status: data.status,
        orderItems: {
            create: data.orderItems.map((item: { ingredientId: string, supplierId: string, locationId: string, quantity: number }) => ({
                ingredientId: item.ingredientId,
                supplierId: item.supplierId,
                locationId: item.locationId,
                quantity: item.quantity,
            })),
        },
    };

    try {
        const newItem = await model.create({
            data: orderData,
            include: {
                orderItems: {
                    include: {
                        ingredient: true,
                        supplier: true,
                        location: true,
                    },
                },
                user: true,
            },
        });

        // Generate PDF
        const pdfUrl = await generatePdf(newItem);
        await model.update({
            where: { id: newItem.id },
            data: { pdfUrl },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
