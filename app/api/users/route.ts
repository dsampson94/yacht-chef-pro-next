import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

const RESOURCE_NAME = 'users';
const model = prisma.user;

export async function GET() {
    try {
        const items = await model.findMany();
        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const data = await req.json();

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role,
    };

    try {
        const createdUser = await model.create({
            data: newUser,
        });
        return NextResponse.json(createdUser, { status: 201 });
    } catch (error) {
        console.error(`Error creating ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error creating ${RESOURCE_NAME}` }, { status: 500 });
    }
}
