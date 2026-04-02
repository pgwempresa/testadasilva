function collectStringValues(value, results = [], seen = new WeakSet()) {
    if (value == null) return results;

    if (typeof value === 'string') {
        results.push(value.trim());
        return results;
    }

    if (typeof value !== 'object') return results;
    if (seen.has(value)) return results;
    seen.add(value);

    if (Array.isArray(value)) {
        value.forEach((item) => collectStringValues(item, results, seen));
        return results;
    }

    Object.values(value).forEach((item) => collectStringValues(item, results, seen));
    return results;
}

function looksLikePixCode(value) {
    if (!value || typeof value !== 'string') return false;
    const normalized = value.replace(/\s+/g, '');
    return normalized.startsWith('000201') && normalized.length > 40;
}

function looksLikeBase64Image(value) {
    if (!value || typeof value !== 'string') return false;
    if (value.startsWith('data:image/')) return true;
    return /^[A-Za-z0-9+/=\s]+$/.test(value) && value.replace(/\s+/g, '').length > 300;
}

function extractPixDetails(source) {
    const values = collectStringValues(source);
    const pixCode = values.find(looksLikePixCode) || "";
    const qrImage = values.find(looksLikeBase64Image) || "";
    return { pixCode, qrImage };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'Transaction ID is required' });

    const sk = process.env.BESTFY_SECRET_KEY;
    if (!sk) {
        return res.status(500).json({
            message: 'BESTFY_SECRET_KEY nao configurada no ambiente'
        });
    }
    const authHeader = 'Basic ' + Buffer.from(sk + ':x').toString('base64');

    try {
        const response = await fetch(`https://api.bestfybr.com.br/v1/transactions/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': authHeader
            }
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.error('Bestfy status error', {
                status: response.status,
                transactionId: id,
                data
            });
        }
        const transaction = data.transaction || data.data || data.result || data;
        const pix = transaction.pix || data.pix || {};
        const extracted = extractPixDetails(data);
        const qrCode =
            pix.qrcode ||
            pix.qrCode ||
            transaction.qrCode ||
            data.qrCode ||
            transaction.qrcode ||
            data.qrcode ||
            pix.code ||
            transaction.pixCode ||
            data.pixCode ||
            pix.copyPaste ||
            transaction.copyPaste ||
            data.copyPaste ||
            pix.url ||
            transaction.url ||
            data.url ||
            extracted.pixCode ||
            "";
        const qrCodeBase64 =
            pix.qrCodeBase64 ||
            transaction.qrCodeBase64 ||
            data.qrCodeBase64 ||
            pix.qrImage ||
            transaction.qrImage ||
            data.qrImage ||
            pix.encodedImage ||
            transaction.encodedImage ||
            data.encodedImage ||
            extracted.qrImage ||
            "";

        return res.status(response.status).json({
            ...data,
            transaction,
            id: transaction.id || data.id || null,
            status: transaction.status || data.status || null,
            qrCode,
            qrCodeBase64
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno ao checar status', error: error.message });
    }
}
