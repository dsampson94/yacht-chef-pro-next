import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { username, password } = req.body;

    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        console.log('User Found:', user); // Log the found user

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        return res.status(200).json({ ...user, password: undefined });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
    }
}
