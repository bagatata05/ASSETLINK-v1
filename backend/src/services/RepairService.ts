import { repairRepository, assetRepository, auditRepository, taskRepository } from '../repositories';
import { v4 as uuidv4 } from 'uuid';

export class RepairService {
    async getAllRequests() {
        return await repairRepository.findAll();
    }

    async getRequestsBySchool(schoolId: string) {
        return await repairRepository.findBySchool(schoolId);
    }

    async getWithFilters(filters: Record<string, any>) {
        return await repairRepository.findWithFilters(filters);
    }

    async getRequestById(id: string) {
        const request = await repairRepository.findById(id);
        if (!request) throw { status: 404, message: 'Repair request not found' };
        return request;
    }

    async createRequest(data: any, user: any) {
        const id = `rr_${Date.now()}`;
        const requestNumber = `RR-${Date.now().toString().slice(-6)}`;
        
        const newRequest = {
            ...data,
            id,
            request_number: requestNumber,
            status: 'Pending',
            reported_by_email: user.email,
            reported_by_name: user.full_name,
            school_id: user.school_id,
            created_date: new Date()
        };

        const result = await repairRepository.create(newRequest);

        await auditRepository.create({
            id: `audit_${Date.now()}`,
            user_id: user.uid,
            user_name: user.full_name,
            action: 'CREATE_REPAIR_REQUEST',
            entity_type: 'RepairRequest',
            entity_id: id,
            details: `Created request ${requestNumber}`
        });

        return result;
    }

    async updateRequest(id: string, data: any, user: any) {
        // Ensure the ID exists
        const existing = await this.getRequestById(id);
        
        // Transform date strings to real Date objects for MySQL/Drizzle compatibility
        const transformedData = { ...data };
        const dateFields = ['scheduled_start_date', 'sla_deadline', 'completed_date'];
        
        dateFields.forEach(field => {
            if (transformedData[field] && typeof transformedData[field] === 'string') {
                transformedData[field] = new Date(transformedData[field]);
            }
        });

        const result = await repairRepository.update(id, transformedData);

        // Sync with Maintenance Tasks if assigned and In Progress
        if (transformedData.status === 'In Progress' || (existing.status === 'In Progress' && transformedData.assigned_to_email)) {
            console.log('[RepairService] Syncing task for request:', id);
            const taskData = {
                repair_request_id: id,
                request_number: existing.request_number,
                asset_name: transformedData.asset_name || existing.asset_name,
                school_id: existing.school_id,
                school_name: existing.school_name,
                assigned_to_email: transformedData.assigned_to_email || existing.assigned_to_email,
                assigned_to_name: transformedData.assigned_to_name || existing.assigned_to_name,
                status: 'In Progress', // Map 'In Progress' from repair to maintenance task status
                priority: transformedData.priority || existing.priority,
                start_date: transformedData.scheduled_start_date || existing.scheduled_start_date,
            };

            const existingTask = await taskRepository.findByRepairRequestId(id);
            if (existingTask) {
                console.log('[RepairService] Updating existing task:', existingTask.id);
                await taskRepository.update(existingTask.id, taskData);
            } else {
                const newTaskId = `task_${Date.now()}`;
                console.log('[RepairService] Creating new task:', newTaskId);
                await taskRepository.create({
                    ...taskData,
                    id: newTaskId,
                });
            }
        }

        await auditRepository.create({
            id: `audit_${Date.now()}`,
            user_id: user.uid,
            user_name: user.full_name,
            action: 'UPDATE_REPAIR_REQUEST',
            entity_type: 'RepairRequest',
            entity_id: id,
            details: `Updated request fields: ${Object.keys(data).join(', ')}`
        });

        return result;
    }

    async updateStatus(id: string, status: string, notes: string, user: any) {
        const updateData: any = { status };
        
        if (user.role === 'principal') {
            updateData.principal_notes = notes;
        } else if (user.role === 'maintenance') {
            updateData.maintenance_notes = notes;
        }

        const result = await repairRepository.update(id, updateData);

        await auditRepository.create({
            id: `audit_${Date.now()}`,
            user_id: user.uid,
            user_name: user.full_name,
            action: 'UPDATE_REPAIR_STATUS',
            entity_type: 'RepairRequest',
            entity_id: id,
            details: `Updated status to ${status}. Notes: ${notes}`
        });

        return result;
    }
}

export const repairService = new RepairService();
