import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { photoService } from '../services/PhotoService';

export class PhotoController extends BaseController {
    streamPhoto = async (req: Request, res: Response) => {
        try {
            const photo = await photoService.getPhoto(req.params.id as string);
            res.setHeader('Content-Type', photo.mime_type);
            // @ts-ignore
            res.send(photo.data);
        } catch (error) {
            this.handleError(res, error, 'PhotoController.streamPhoto');
        }
    };

    upload = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return this.handleError(res, { status: 400, message: 'No file uploaded' }, 'PhotoController.upload');
            }

            const id = `ph_${Date.now()}`;
            const entityId = req.body.entity_id || 'unassigned';
            const entityType = req.body.entity_type || 'General';

            await photoService.uploadPhoto(
                id,
                entityId,
                entityType,
                req.file.buffer,
                req.file.mimetype
            );

            this.handleSuccess(res, { 
                photo_id: id, 
                photo_url: `/api/v1/photos/${id}` 
            }, 'Photo uploaded successfully', 201);
        } catch (error) {
            this.handleError(res, error, 'PhotoController.upload');
        }
    };
}

export const photoController = new PhotoController();
