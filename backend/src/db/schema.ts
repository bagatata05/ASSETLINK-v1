import { mysqlTable, varchar, text, datetime, boolean, decimal, customType } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

const longblob = customType<{ data: Buffer }>({
    dataType() {
        return 'longblob';
    },
});

export const schools = mysqlTable('schools', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    region: varchar('region', { length: 100 }),
    division: varchar('division', { length: 100 }),
    principal_name: varchar('principal_name', { length: 255 }),
    contact_email: varchar('contact_email', { length: 255 }),
    contact_phone: varchar('contact_phone', { length: 50 }),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const users = mysqlTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(), // Firebase UID
    email: varchar('email', { length: 255 }).notNull().unique(),
    full_name: varchar('full_name', { length: 255 }),
    role: varchar('role', { length: 50 }).notNull(), // admin, teacher, principal, maintenance, supervisor
    school_id: varchar('school_id', { length: 255 }).references(() => schools.id),
    school_name: varchar('school_name', { length: 255 }),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const assets = mysqlTable('assets', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    asset_code: varchar('asset_code', { length: 50 }).notNull().unique(),
    category: varchar('category', { length: 100 }).notNull(),
    condition: varchar('condition', { length: 50 }).notNull(),
    location: varchar('location', { length: 255 }),
    school_id: varchar('school_id', { length: 255 }).references(() => schools.id),
    school_name: varchar('school_name', { length: 255 }),
    serial_number: varchar('serial_number', { length: 255 }),
    purchase_date: datetime('purchase_date'),
    purchase_value: decimal('purchase_value', { precision: 12, scale: 2 }),
    photo_url: text('photo_url'), // points to /api/v1/photos/:id
    description: text('description'),
    is_active: boolean('is_active').default(true),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const repairRequests = mysqlTable('repair_requests', {
    id: varchar('id', { length: 255 }).primaryKey(),
    request_number: varchar('request_number', { length: 50 }).notNull().unique(),
    asset_id: varchar('asset_id', { length: 255 }).references(() => assets.id),
    asset_name: varchar('asset_name', { length: 255 }),
    asset_code: varchar('asset_code', { length: 50 }),
    school_id: varchar('school_id', { length: 255 }).references(() => schools.id),
    school_name: varchar('school_name', { length: 255 }),
    reported_by_email: varchar('reported_by_email', { length: 255 }),
    reported_by_name: varchar('reported_by_name', { length: 255 }),
    description: text('description').notNull(),
    photo_url: text('photo_url'),
    priority: varchar('priority', { length: 50 }).notNull(), // Low, Medium, High, Critical
    status: varchar('status', { length: 50 }).notNull(), // Pending, Approved, In Progress, Completed, Rejected, Escalated
    assigned_to_email: varchar('assigned_to_email', { length: 255 }),
    assigned_to_name: varchar('assigned_to_name', { length: 255 }),
    principal_notes: text('principal_notes'),
    maintenance_notes: text('maintenance_notes'),
    teacher_confirmation: boolean('teacher_confirmation').default(false),
    escalated_reason: text('escalated_reason'),
    estimated_cost: decimal('estimated_cost', { precision: 12, scale: 2 }),
    scheduled_start_date: datetime('scheduled_start_date'),
    sla_deadline: datetime('sla_deadline'),
    completed_date: datetime('completed_date'),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const maintenanceTasks = mysqlTable('maintenance_tasks', {
    id: varchar('id', { length: 255 }).primaryKey(),
    repair_request_id: varchar('repair_request_id', { length: 255 }).references(() => repairRequests.id),
    request_number: varchar('request_number', { length: 50 }),
    asset_name: varchar('asset_name', { length: 255 }),
    school_id: varchar('school_id', { length: 255 }).references(() => schools.id),
    school_name: varchar('school_name', { length: 255 }),
    assigned_to_email: varchar('assigned_to_email', { length: 255 }),
    assigned_to_name: varchar('assigned_to_name', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull(), // Assigned, In Progress, On Hold, Completed, Pending Teacher Verification
    teacher_confirmation: boolean('teacher_confirmation').default(false),
    teacher_verification_notes: text('teacher_verification_notes'),
    verified_by_email: varchar('verified_by_email', { length: 255 }),
    verified_date: datetime('verified_date'),
    priority: varchar('priority', { length: 50 }),
    notes: text('notes'),
    materials_used: text('materials_used'),
    actual_cost: decimal('actual_cost', { precision: 12, scale: 2 }),
    start_date: datetime('start_date'),
    reschedule_count: decimal('reschedule_count', { precision: 5, scale: 0 }).default('0'),
    reschedule_notes: text('reschedule_notes'),
    completed_date: datetime('completed_date'),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const photos = mysqlTable('photos', {
    id: varchar('id', { length: 255 }).primaryKey(),
    entity_id: varchar('entity_id', { length: 255 }).notNull(),
    entity_type: varchar('entity_type', { length: 50 }).notNull(), // Asset, RepairRequest
    data: longblob('data').notNull(),
    mime_type: varchar('mime_type', { length: 100 }).notNull(),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});

export const auditLogs = mysqlTable('audit_logs', {
    id: varchar('id', { length: 255 }).primaryKey(),
    user_id: varchar('user_id', { length: 255 }),
    user_name: varchar('user_name', { length: 255 }),
    action: varchar('action', { length: 100 }).notNull(),
    entity_type: varchar('entity_type', { length: 50 }),
    entity_id: varchar('entity_id', { length: 255 }),
    details: text('details'),
    ip_address: varchar('ip_address', { length: 50 }),
    created_date: datetime('created_date').default(sql`CURRENT_TIMESTAMP`),
});
