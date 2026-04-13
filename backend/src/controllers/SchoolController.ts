import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { schoolService } from '../services/SchoolService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class SchoolController extends BaseController {
    getAll = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const filters = req.query as Record<string, string>;
            const schools = await schoolService.getWithFilters(filters);
            this.handleSuccess(res, schools);
        } catch (error) {
            this.handleError(res, error, 'SchoolController.getAll');
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const school = await schoolService.getSchoolById(req.params.id as string);
            this.handleSuccess(res, school);
        } catch (error) {
            this.handleError(res, error, 'SchoolController.getById');
        }
    };
}

export const schoolController = new SchoolController();
