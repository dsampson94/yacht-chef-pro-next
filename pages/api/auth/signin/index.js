import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        return res.status(200).json({ ...user, password: undefined });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
    }
}
