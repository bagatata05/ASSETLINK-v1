import { assetRepository, repairRepository } from '../repositories';

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
        return await assetRepository.create(data);
    }

    async updateAsset(id: string, data: any) {
        return await assetRepository.update(id, data);
    }

    async deleteAsset(id: string) {
        const linkedRepairs = await repairRepository.findByAssetId(id);
        if (linkedRepairs && linkedRepairs.length > 0) {
            throw { 
                status: 400, 
                message: `Cannot delete asset. It has ${linkedRepairs.length} linked repair request(s). Please resolve or remove linked requests first.` 
            };
        }
        return await assetRepository.delete(id);
    }
}

export const assetService = new AssetService();
