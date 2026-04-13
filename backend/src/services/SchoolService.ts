import { schoolRepository } from '../repositories';

export class SchoolService {
    async getAllSchools() {
        return await schoolRepository.findAll();
    }

    async getWithFilters(filters: Record<string, any>) {
        return await schoolRepository.findWithFilters(filters);
    }

    async getSchoolById(id: string) {
        const school = await schoolRepository.findById(id);
        if (!school) throw { status: 404, message: 'School not found' };
        return school;
    }
}

export const schoolService = new SchoolService();
