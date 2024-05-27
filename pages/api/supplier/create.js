// pages/api/suppliers/index.jsx
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, phone, locationIds } = req.body;

    if (!name || !email || !phone || !locationIds.length) {
        return res.status(400).json({ error: 'Name, email, phone, and at least one location are required' });
    }

    try {
        const existingSupplier = await prisma.supplier.findUnique({
            where: { email },
        });

        if (existingSupplier) {
            return res.status(409).json({ error: 'Supplier already exists' });
        }

        const supplier = await prisma.supplier.create({
            data: {
                name,
                email,
                phone,
                locations: {
                    create: locationIds.map(locationId => ({
                        location: { connect: { id: locationId } },
                    })),
                },
            },
        });

        return res.status(201).json(supplier);
    } catch (error) {
        console.error('Error creating supplier:', error);
        return res.status(500).json({ error: 'Error creating supplier' });
    }
}
