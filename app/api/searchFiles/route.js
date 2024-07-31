import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const antibiotic = searchParams.get('antibiotic');
    const organism = searchParams.get('organism');

    if (!antibiotic || !organism) {
        return new Response(JSON.stringify({ error: 'Missing query parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const publicFolderPath = path.join(process.cwd(), 'public');
    const searchPattern = `${antibiotic}_${organism}_`;

    try {
        const files = fs.readdirSync(publicFolderPath);

        const matchingFiles = files.filter(file => file.startsWith(searchPattern) && file.endsWith('.pdf'));

        return new Response(JSON.stringify({ files: matchingFiles }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error reading files:', error);
        return new Response(JSON.stringify({ error: 'Error reading files' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}