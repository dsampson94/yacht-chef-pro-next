import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (!username || !password) {
        console.log('Missing username or password');
        return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        console.log('User Found:', user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid username or password');
            return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
        }

        return NextResponse.json({ ...user, password: undefined });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'An error occurred during login. Please try again later.' }, { status: 500 });
    }
}
