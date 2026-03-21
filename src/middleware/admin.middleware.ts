// src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user as any;

    console.log('🛡️ Admin middleware:');
    console.log('  - user:', user ? user.email : 'null');
    console.log('  - role:', user ? user.role : 'null');

    if (!user) {
        console.log('❌ Admin check: no user found (authenticate belum dipanggil?)');
        return sendError(res, 'Unauthorized', 401);
    }

    if (user.role !== 'ADMIN') {
        console.log('❌ Admin check: role bukan ADMIN, role saat ini:', user.role);
        return sendError(res, 'Forbidden: hanya admin yang dapat mengakses', 403);
    }

    console.log('✅ Admin check: lolos');
    next();
};