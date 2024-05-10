import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { name, email, phoneNumber, billingAddress, shippingAddress, contactPerson } = req.body;

        const result = await prisma.client.create({
            data: {
                name,
                email,
                phoneNumber,
                billingAddress,
                shippingAddress,
                contactPerson,
            },
        });
        res.status(201).json(result);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
