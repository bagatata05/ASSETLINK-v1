import { Response } from 'express';
import { BaseController } from './BaseController';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController extends BaseController {
    me = async (req: AuthenticatedRequest, res: Response) => {
        try {
            if (!req.user) {
                return this.handleError(res, { status: 401, message: 'Not authenticated' }, 'AuthController.me');
            }
            
            this.handleSuccess(res, req.user);
        } catch (error) {
            this.handleError(res, error, 'AuthController.me');
        }
    };
}

export const authController = new AuthController();
