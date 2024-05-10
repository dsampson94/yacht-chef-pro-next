import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = sign(
            { email: user.email, id: user.id, time: Date.now() },
            'secret',
            { expiresIn: '8h' }
        );

        const serialized = serialize('myTokenName', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
        });

        res.setHeader('Set-Cookie', serialized);

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An error occurred during login.' });
    }
}
