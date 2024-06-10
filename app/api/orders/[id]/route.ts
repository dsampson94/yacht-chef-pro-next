import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { generatePdf } from '../../../../lib/pdf';

const RESOURCE_NAME = 'orders';
const model = prisma.order;

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const item = await getOrderDetails(id);
        if (!item) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    const { id } = params;
    const data = await req.json();

    try {
        const updatedItem = await model.update({
            where: { id },
            data: {
                userId: data.userId,
                date: new Date(data.date),
                status: data.status,
                orderItems: {
                    deleteMany: {},
                    create: data.orderItems.map((item: { ingredientId: string, supplierId: string, locationId: string, quantity: number }) => ({
                        ingredientId: item.ingredientId,
                        supplierId: item.supplierId,
                        locationId: item.locationId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                user: true,
                orderItems: {
                    include: {
                        ingredient: true,
                        supplier: true,
                        location: true,
                    },
                },
            },
        });

        // Generate PDF
        const pdfUrl = await generatePdf(updatedItem);
        await model.update({
            where: { id: updatedItem.id },
            data: { pdfUrl },
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error(`Error updating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error updating ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;

    try {
        await prisma.orderItem.deleteMany({
            where: { orderId: id }
        });
        await model.delete({ where: { id } });
        return NextResponse.json({ message: `${RESOURCE_NAME.slice(0, -1)} deleted` });
    } catch (error) {
        console.error(`Error deleting ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error deleting ${RESOURCE_NAME}` }, { status: 500 });
    }
}

const getOrderDetails = async (orderId: string) => {
    return prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            orderItems: {
                include: {
                    ingredient: true,
                    supplier: true,
                    location: true,
                },
            },
        },
    });
};
