import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { assetService } from '../services/AssetService';
import { createAssetSchema, updateAssetSchema } from '../validators/assetValidators';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AssetController extends BaseController {
    getAll = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // Support query filters from URL
            const filters = req.query as Record<string, string>;
            const role = req.user?.role;
            
            let assets;
            if (Object.keys(filters).length > 0) {
                assets = await assetService.getWithFilters(filters);
            } else if (role === 'admin' || role === 'supervisor') {
                assets = await assetService.getAllAssets();
            } else {
                assets = await assetService.getAssetsBySchool(req.user?.school_id || '');
            }

            this.handleSuccess(res, assets);
        } catch (error) {
            this.handleError(res, error, 'AssetController.getAll');
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const asset = await assetService.getAssetById(req.params.id as string);
            this.handleSuccess(res, asset);
        } catch (error) {
            this.handleError(res, error, 'AssetController.getById');
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const validatedData = createAssetSchema.parse(req.body);
            const asset = await assetService.createAsset(validatedData);
            this.handleSuccess(res, asset, 'Asset created successfully', 201);
        } catch (error) {
            this.handleError(res, error, 'AssetController.create');
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const validatedData = updateAssetSchema.parse(req.body);
            const asset = await assetService.updateAsset(req.params.id as string, validatedData);
            this.handleSuccess(res, asset, 'Asset updated successfully');
        } catch (error) {
            this.handleError(res, error, 'AssetController.update');
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            await assetService.deleteAsset(req.params.id as string);
            this.handleSuccess(res, null, 'Asset deleted successfully');
        } catch (error) {
            this.handleError(res, error, 'AssetController.delete');
        }
    };
}

export const assetController = new AssetController();
