import { photoRepository } from '../repositories';

export class PhotoService {
    async getPhoto(id: string) {
        const photo = await photoRepository.findById(id);
        if (!photo) throw { status: 404, message: 'Photo not found' };
        return photo;
    }

    async uploadPhoto(id: string, entityId: string, entityType: string, buffer: Buffer, mimeType: string) {
        return await photoRepository.create({
            id,
            entity_id: entityId,
            entity_type: entityType,
            data: buffer,
            mime_type: mimeType
        });
    }
}

export const photoService = new PhotoService();
