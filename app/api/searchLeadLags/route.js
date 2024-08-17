import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const organism = searchParams.get('organism');
    const sampleType = searchParams.get('sampleType');

    if (!organism || !sampleType) {
        return new Response(JSON.stringify({ error: 'Missing query parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const publicFolderPath = path.join(process.cwd(), 'public/lead-lags');
    const fileName = `${organism}_${sampleType}.pdf`;
    const filePath = path.join(publicFolderPath, fileName);

    try {
        if (!fs.existsSync(filePath)) {
            return new Response(JSON.stringify({ error: 'No matching file found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // URL-encode the file name for the download link
        const encodedFileName = encodeURIComponent(fileName);
        const fileUrl = `/lead-lags/${encodedFileName}`;

        return new Response(JSON.stringify({ fileUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error accessing file:', error);
        return new Response(JSON.stringify({ error: 'Error accessing file' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}