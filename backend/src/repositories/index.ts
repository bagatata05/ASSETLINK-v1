import { BaseRepository } from './BaseRepository';
import { assets, schools, users, repairRequests, maintenanceTasks, photos, auditLogs } from '../db/schema';
import { db } from '../db';
import { eq, and } from 'drizzle-orm';

export class SchoolRepository extends BaseRepository<typeof schools> {
    constructor() { super(schools); }
}

export class UserRepository extends BaseRepository<typeof users> {
    constructor() { super(users); }
    async findByEmail(email: string) {
        return (await db.select().from(users).where(eq(users.email, email)))[0];
    }
}

export class AssetRepository extends BaseRepository<typeof assets> {
    constructor() { super(assets); }
    async findBySchool(schoolId: string) {
        return await db.select().from(assets).where(eq(assets.school_id, schoolId));
    }
}

export class RepairRepository extends BaseRepository<typeof repairRequests> {
    constructor() { super(repairRequests); }
    async findBySchool(schoolId: string) {
        return await db.select().from(repairRequests).where(eq(repairRequests.school_id, schoolId));
    }
    async findByStatus(status: string) {
        return await db.select().from(repairRequests).where(eq(repairRequests.status, status));
    }
    async findByAssetId(assetId: string) {
        return await db.select().from(repairRequests).where(eq(repairRequests.asset_id, assetId));
    }
}

export class TaskRepository extends BaseRepository<typeof maintenanceTasks> {
    constructor() { super(maintenanceTasks); }
    async findByAssignedStaff(email: string) {
        return await db.select().from(maintenanceTasks).where(eq(maintenanceTasks.assigned_to_email, email));
    }
    async findByRepairRequestId(requestId: string) {
        return (await db.select().from(maintenanceTasks).where(eq(maintenanceTasks.repair_request_id, requestId)))[0];
    }
}

export class PhotoRepository extends BaseRepository<typeof photos> {
    constructor() { super(photos); }
}

export class AuditRepository extends BaseRepository<typeof auditLogs> {
    constructor() { super(auditLogs); }
}

// Export instances
export const schoolRepository = new SchoolRepository();
export const userRepository = new UserRepository();
export const assetRepository = new AssetRepository();
export const repairRepository = new RepairRepository();
export const taskRepository = new TaskRepository();
export const photoRepository = new PhotoRepository();
export const auditRepository = new AuditRepository();
