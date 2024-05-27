import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    const { method } = req;

    switch (method) {
        // Get a single location
        case 'GET':
            try {
                const location = await prisma.location.findUnique({
                    where: { id },
                });
                return res.status(200).json(location);
            } catch (error) {
                console.error('Error fetching location:', error);
                return res.status(500).json({ error: 'Error fetching location' });
            }

        // Update a location
        case 'PUT':
            const { city, country } = req.body;

            if (!city || !country) {
                return res.status(400).json({ error: 'City and country are required' });
            }

            try {
                const location = await prisma.location.update({
                    where: { id },
                    data: { city, country },
                });
                return res.status(200).json(location);
            } catch (error) {
                console.error('Error updating location:', error);
                return res.status(500).json({ error: 'Error updating location' });
            }

        // Delete a location
        case 'DELETE':
            try {
                await prisma.location.delete({
                    where: { id },
                });
                return res.status(204).end();
            } catch (error) {
                console.error('Error deleting location:', error);
                return res.status(500).json({ error: 'Error deleting location' });
            }

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
