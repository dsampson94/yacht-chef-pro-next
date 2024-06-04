import { NextResponse } from 'next/server';

export const validateData = (resource: string, data: any, requiredFields?: string[]) => {
    if (requiredFields && Array.isArray(requiredFields)) {
        for (const field of requiredFields) {
            if (!data[field]) {
                return { error: NextResponse.json({ error: `${field} is required for ${resource}` }, { status: 400 }) };
            }
        }
    }
    return { isValid: true };
};
