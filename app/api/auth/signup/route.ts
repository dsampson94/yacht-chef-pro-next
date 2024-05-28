import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password: string) => password.length >= 8;

export async function POST(req: Request) {
    const { email, password, username } = await req.json();

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return NextResponse.json({ error: 'Invalid email format or password too short.' }, { status: 400 });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: 'Email is already in use.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ id: user.id, email: user.email, username: user.username }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'An error occurred during signup. Please try again later.' }, { status: 500 });
    }
}
