import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'lib', 'data.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileContents));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Only allow modifications in development mode for Local CMS
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const newData = await request.json();
        const filePath = path.join(process.cwd(), 'lib', 'data.json');
        
        // Pretty print with 4 spaces to maintain readability
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 4), 'utf8');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
    }
}
