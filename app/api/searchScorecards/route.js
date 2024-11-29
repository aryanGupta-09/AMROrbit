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

    const publicFolderPath = path.join(process.cwd(), 'public', 'scorecards', organism, sampleType);

    try {
        if (!fs.existsSync(publicFolderPath)) {
            console.error('Folder does not exist:', publicFolderPath);
            return new Response(JSON.stringify({ error: 'Folder not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const yearsFilePath = path.join(publicFolderPath, `${antibiotic}_${organism}_year.json`);
        const countriesFilePath = path.join(publicFolderPath, `${antibiotic}_${organism}_countries.json`);

        let years = [];
        let countries = [];

        if (fs.existsSync(yearsFilePath)) {
            try {
                years = JSON.parse(fs.readFileSync(yearsFilePath, 'utf-8'));
            } catch (error) {
                console.error('Error parsing years.json:', error);
            }
        }

        if (fs.existsSync(countriesFilePath)) {
            try {
                countries = JSON.parse(fs.readFileSync(countriesFilePath, 'utf-8'));
            } catch (error) {
                console.error('Error parsing countries.json:', error);
            }
        }

        if (years.length === 0 && countries.length === 0) {
            return new Response(JSON.stringify({ error: 'Files not found or invalid' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ years, countries }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error reading files:', error);
        return new Response(JSON.stringify({ error: 'Error reading files' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}