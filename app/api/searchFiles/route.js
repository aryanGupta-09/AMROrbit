import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const antibiotic = searchParams.get('antibiotic');
    const organism = searchParams.get('organism');
    const sampleType = searchParams.get('sampleType');

    if (!antibiotic || !organism || !sampleType) {
        return new Response(JSON.stringify({ error: 'Missing query parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const publicFolderPath = path.join(process.cwd(), 'public', 'json-data', sampleType, `${antibiotic}_${organism}`);

    try {
        const yearsFilePath = path.join(publicFolderPath, 'years.json');
        const countriesFilePath = path.join(publicFolderPath, 'countries.json');

        if (!fs.existsSync(yearsFilePath) || !fs.existsSync(countriesFilePath)) {
            return new Response(JSON.stringify({ error: 'Files not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const years = JSON.parse(fs.readFileSync(yearsFilePath, 'utf-8'));
        const countries = JSON.parse(fs.readFileSync(countriesFilePath, 'utf-8'));

        return new Response(JSON.stringify({ years, countries }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error reading files:', error);
        return new Response(JSON.stringify({ error: 'Error reading files' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}