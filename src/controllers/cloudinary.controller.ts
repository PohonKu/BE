import { Request, Response } from 'express';
import crypto from 'crypto';


export const getUploadSignature = (req: Request, res: Response) => {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
        return res.status(500).json({
            success: false,
            message: 'Cloudinary env variables belum dikonfigurasi',
        });
    }

    // Folder tujuan upload — bisa dikustomisasi per role
    const folder = 'pohonku/tree-updates';
    const timestamp = Math.floor(Date.now() / 1000);

    // String yang di-sign: parameter harus urut alfabet
    const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha256').update(toSign).digest('hex');

    return res.json({
        success: true,
        data: {
            signature,
            timestamp,
            apiKey,
            cloudName,
            folder,
        },
    });
};