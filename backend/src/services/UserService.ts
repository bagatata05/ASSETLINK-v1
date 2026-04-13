import { userRepository, repairRepository } from '../repositories';
import { eq, and, count } from 'drizzle-orm';
import { repairRequests } from '../db/schema';
import { db } from '../db';

export class UserService {
    async getMaintenanceStaffWithWorkload() {
        // 1. Fetch all maintenance staff
        const staff = await userRepository.findWithFilters({ role: 'maintenance' });

        // 2. Fetch active task counts for each staff member
        // We count repair requests assigned to them that are 'Pending', 'Approved', or 'In Progress'
        // Actually, just 'In Progress' is the most relevant workload indicator
        const workloadCounts = await db.select({
            email: repairRequests.assigned_to_email,
            count: count()
        })
        .from(repairRequests)
        .where(
            and(
                eq(repairRequests.status, 'In Progress')
            )
        )
        .groupBy(repairRequests.assigned_to_email);

        // 3. Merge workload counts into staff data
        return staff.map(s => {
            const workload = workloadCounts.find(w => w.email === s.email);
            return {
                ...s,
                active_tasks: workload ? workload.count : 0
            };
        });
    }

    async getUsers(filters: Record<string, any>) {
        return await userRepository.findWithFilters(filters);
    }
}

export const userService = new UserService();
