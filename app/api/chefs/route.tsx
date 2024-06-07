import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

const RESOURCE_NAME = 'users';
const model = prisma.user;

export async function GET() {
    try {
        const items = await model.findMany({
            where: { role: 'CHEF' },
            select: { id: true, username: true }
        });
        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching ${RESOURCE_NAME}: ${error.message}`);
        return NextResponse.json({ error: `Error fetching ${RESOURCE_NAME}` }, { status: 500 });
    }
}
