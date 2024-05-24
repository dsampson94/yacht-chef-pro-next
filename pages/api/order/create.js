// pages/api/orders/create.js
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { orderItems } = req.body;

    if (!orderItems || !orderItems.length) {
        return res.status(400).json({ error: 'At least one order item is required' });
    }

    try {
        const order = await prisma.order.create({
            data: {
                user: { connect: { id: session.user.id } },
                orderItems: {
                    create: orderItems.map(item => ({
                        ingredient: { connect: { id: item.ingredientId } },
                        supplier: { connect: { id: item.supplierId } },
                        location: { connect: { id: item.locationId } },
                        quantity: item.quantity,
                    })),
                },
            },
        });

        // Send email notifications to suppliers
        for (const item of orderItems) {
            const supplier = await prisma.supplier.findUnique({
                where: { id: item.supplierId },
            });

            // Send email logic here using a mail service like nodemailer
        }

        return res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Error creating order' });
    }
}
