// pages/api/ingredients/index.jsx
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, weight, price, supplierId, locationId } = req.body;

    if (!name || !weight || !price || !supplierId || !locationId) {
        return res.status(400).json({ error: 'Name, weight, price, supplier, and location are required' });
    }

    try {
        const existingIngredient = await prisma.ingredient.findUnique({
            where: { name_weight_price: { name, weight, price } },
        });

        if (existingIngredient) {
            return res.status(409).json({ error: 'Ingredient already exists' });
        }

        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                description,
                weight,
                price,
                supplierIngredients: {
                    create: {
                        supplier: { connect: { id: supplierId } },
                        location: { connect: { id: locationId } },
                    },
                },
            },
        });

        return res.status(201).json(ingredient);
    } catch (error) {
        console.error('Error creating ingredient:', error);
        return res.status(500).json({ error: 'Error creating ingredient' });
    }
}
