import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password) => password.length >= 8;

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, password, username } = req.body;

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return res.status(400).json({ error: 'Invalid email format or password too short.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ error: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ id: user.id, email: user.email, username: user.username });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'An error occurred during signup. Please try again later.' });
    }
}
