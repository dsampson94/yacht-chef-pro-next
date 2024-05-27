// pages/api/menus/index.jsx
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { weekOfYear, menuItems } = req.body;

    if (!weekOfYear || !menuItems || !menuItems.length) {
        return res.status(400).json({ error: 'Week of year and at least one menu item are required' });
    }

    try {
        const menu = await prisma.menu.create({
            data: {
                chef: { connect: { userId: session.user.id } },
                weekOfYear,
                menuItems: {
                    create: menuItems.map(item => ({
                        name: item.name,
                        description: item.description,
                        ingredients: {
                            connect: item.ingredientIds.map(id => ({ id })),
                        },
                    })),
                },
            },
        });

        return res.status(201).json(menu);
    } catch (error) {
        console.error('Error creating menu:', error);
        return res.status(500).json({ error: 'Error creating menu' });
    }
}
