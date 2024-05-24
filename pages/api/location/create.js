// pages/api/locations/create.js
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { city, country } = req.body;

    if (!city || !country) {
        return res.status(400).json({ error: 'City and country are required' });
    }

    try {
        const existingLocation = await prisma.location.findUnique({
            where: { city_country: { city, country } },
        });

        if (existingLocation) {
            return res.status(409).json({ error: 'Location already exists' });
        }

        const location = await prisma.location.create({
            data: {
                city,
                country,
            },
        });

        return res.status(201).json(location);
    } catch (error) {
        console.error('Error creating location:', error);
        return res.status(500).json({ error: 'Error creating location' });
    }
}
