export async function onRequest(context) {
    const url = new URL(context.request.url);

    // Fetch the gzipped file from compressed folder
    const compressedUrl = url.origin + '/Build/compressed/QCEXEWEB.data.gz';
    const response = await fetch(compressedUrl);

    if (!response.ok) {
        return new Response('File not found', { status: 404 });
    }

    // Read the gzipped content
    const gzippedData = await response.arrayBuffer();

    // Decompress using DecompressionStream
    const ds = new DecompressionStream('gzip');
    const decompressedStream = new Response(gzippedData).body.pipeThrough(ds);
    const decompressedData = await new Response(decompressedStream).arrayBuffer();

    // Return decompressed content with correct MIME type
    return new Response(decompressedData, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=31536000'
        }
    });
}
