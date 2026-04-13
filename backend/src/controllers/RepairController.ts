import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { repairService } from '../services/RepairService';
import { createRepairSchema, updateRepairSchema, updateRepairStatusSchema } from '../validators/repairValidators';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class RepairController extends BaseController {
    getAll = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const filters = req.query as Record<string, string>;
            const role = req.user?.role;
            
            let requests;
            if (Object.keys(filters).length > 0) {
                requests = await repairService.getWithFilters(filters);
            } else if (role === 'admin' || role === 'supervisor') {
                requests = await repairService.getAllRequests();
            } else {
                requests = await repairService.getRequestsBySchool(req.user?.school_id || '');
            }

            this.handleSuccess(res, requests);
        } catch (error) {
            this.handleError(res, error, 'RepairController.getAll');
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const request = await repairService.getRequestById(req.params.id as string);
            this.handleSuccess(res, request);
        } catch (error) {
            this.handleError(res, error, 'RepairController.getById');
        }
    };

    create = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const validatedData = createRepairSchema.parse(req.body);
            const request = await repairService.createRequest(validatedData, req.user);
            this.handleSuccess(res, request, 'Repair request submitted successfully', 201);
        } catch (error) {
            this.handleError(res, error, 'RepairController.create');
        }
    };

    updateStatus = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { status, notes } = updateRepairStatusSchema.parse(req.body);
            const request = await repairService.updateStatus(req.params.id as string, status, notes || '', req.user);
            this.handleSuccess(res, request, 'Status updated successfully');
        } catch (error) {
            this.handleError(res, error, 'RepairController.updateStatus');
        }
    };

    update = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const validatedData = updateRepairSchema.parse(req.body);
            const request = await repairService.updateRequest(req.params.id as string, validatedData, req.user);
            this.handleSuccess(res, request, 'Repair request updated successfully');
        } catch (error) {
            this.handleError(res, error, 'RepairController.update');
        }
    };
}

export const repairController = new RepairController();
