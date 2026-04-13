import { taskRepository, auditRepository } from '../repositories';

export class MaintenanceTaskService {
    async getAllTasks() {
        return await taskRepository.findAll();
    }

    async getWithFilters(filters: Record<string, any>) {
        return await taskRepository.findWithFilters(filters);
    }

    async getTaskById(id: string) {
        const task = await taskRepository.findById(id);
        if (!task) throw { status: 404, message: 'Maintenance task not found' };
        return task;
    }

    async createTask(data: any, user: any) {
        const result = await taskRepository.create(data);
        
        await auditRepository.create({
            id: `audit_${Date.now()}`,
            user_id: user.uid,
            user_name: user.full_name,
            action: 'CREATE_TASK',
            entity_type: 'MaintenanceTask',
            entity_id: data.id,
            details: `Created task ${data.id}`
        });

        return result;
    }

    async updateTask(id: string, data: any, user: any) {
        const result = await taskRepository.update(id, data);
        
        await auditRepository.create({
            id: `audit_${Date.now()}`,
            user_id: user.uid,
            user_name: user.full_name,
            action: 'UPDATE_TASK',
            entity_type: 'MaintenanceTask',
            entity_id: id,
            details: `Updated task ${id}`
        });

        return result;
    }
}

export const maintenanceTaskService = new MaintenanceTaskService();
