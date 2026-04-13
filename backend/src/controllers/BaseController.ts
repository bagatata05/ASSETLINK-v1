import { Response } from 'express';

export abstract class BaseController {
    protected handleSuccess(res: Response, data: any, message: string = 'Success', status: number = 200): void {
        res.status(status).json({
            success: true,
            message,
            data,
        });
    }

    protected handleError(res: Response, error: any, context: string): void {
        console.error(`[${context}] Error:`, error);
        
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        
        res.status(status).json({
            success: false,
            error: message,
            code: error.code || 'INTERNAL_ERROR',
            status,
        });
    }
}
