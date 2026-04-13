import { assetRepository } from '../repositories';

export class AssetService {
    async getAllAssets() {
        return await assetRepository.findAll();
    }

    async getAssetsBySchool(schoolId: string) {
        return await assetRepository.findBySchool(schoolId);
    }

    async getWithFilters(filters: Record<string, any>) {
        return await assetRepository.findWithFilters(filters);
    }

    async getAssetById(id: string) {
        const asset = await assetRepository.findById(id);
        if (!asset) throw { status: 404, message: 'Asset not found' };
        return asset;
    }

    async createAsset(data: any) {
        // Business logic: check code uniqueness etc. (DB Unique constraint handles this too)
        return await assetRepository.create(data);
    }

    async updateAsset(id: string, data: any) {
        return await assetRepository.update(id, data);
    }

    async deleteAsset(id: string) {
        return await assetRepository.delete(id);
    }
}

export const assetService = new AssetService();
