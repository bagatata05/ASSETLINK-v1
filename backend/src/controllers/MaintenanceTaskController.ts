import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { maintenanceTaskService } from '../services/MaintenanceTaskService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class MaintenanceTaskController extends BaseController {
    getAll = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const filters = req.query as Record<string, string>;
            const tasks = await maintenanceTaskService.getWithFilters(filters);
            this.handleSuccess(res, tasks);
        } catch (error) {
            this.handleError(res, error, 'MaintenanceTaskController.getAll');
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const task = await maintenanceTaskService.getTaskById(req.params.id as string);
            this.handleSuccess(res, task);
        } catch (error) {
            this.handleError(res, error, 'MaintenanceTaskController.getById');
        }
    };

    create = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const task = await maintenanceTaskService.createTask(req.body, req.user);
            this.handleSuccess(res, task, 'Task created successfully', 201);
        } catch (error) {
            this.handleError(res, error, 'MaintenanceTaskController.create');
        }
    };

    update = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const task = await maintenanceTaskService.updateTask(req.params.id as string, req.body, req.user);
            this.handleSuccess(res, task, 'Task updated successfully');
        } catch (error) {
            this.handleError(res, error, 'MaintenanceTaskController.update');
        }
    };
}

export const maintenanceTaskController = new MaintenanceTaskController();
