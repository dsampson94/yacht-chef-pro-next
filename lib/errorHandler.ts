import { NextResponse } from 'next/server';

export const handleErrorResponse = (error: Error, resource: string, action: string) => {
    console.error(`Error ${action} ${resource}:`, error.message);
    return NextResponse.json({ error: `Error ${action} ${resource}` }, { status: 500 });
};
