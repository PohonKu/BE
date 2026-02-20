import dotenv from 'dotenv';
import midtransClient from 'midtrans-client';

dotenv.config();

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error('MIDTRANS_SERVER_KEY tidak ada di .env');
}
if (!process.env.MIDTRANS_CLIENT_KEY) {
  throw new Error('MIDTRANS_CLIENT_KEY tidak ada di .env');
}

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});