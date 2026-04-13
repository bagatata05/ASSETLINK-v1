import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { userService } from '../services/UserService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class UserController extends BaseController {
    list = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const role = req.query.role as string;
            const workload = req.query.workload === 'true';

            let users;
            if (role === 'maintenance' && workload) {
                users = await userService.getMaintenanceStaffWithWorkload();
            } else {
                const filters: Record<string, any> = {};
                if (role) filters.role = role;
                users = await userService.getUsers(filters);
            }

            this.handleSuccess(res, users);
        } catch (error) {
            this.handleError(res, error, 'UserController.list');
        }
    };
}

export const userController = new UserController();
