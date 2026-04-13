import { z } from 'zod';

export const createRepairSchema = z.object({
    asset_id: z.string(),
    asset_name: z.string(),
    asset_code: z.string(),
    description: z.string().min(10),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
    photo_url: z.string().optional(),
});

export const updateRepairStatusSchema = z.object({
    status: z.enum(['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Escalated']),
    notes: z.string().optional(),
});

export const updateRepairSchema = z.object({
    status: z.enum(['Pending', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Escalated']).optional(),
    description: z.string().min(10).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
    principal_notes: z.string().optional(),
    maintenance_notes: z.string().optional(),
    teacher_verification_notes: z.string().optional(),
    assigned_to_name: z.string().optional(),
    assigned_to_email: z.string().optional(),
    scheduled_start_date: z.string().optional(),
    sla_deadline: z.string().optional(),
    teacher_confirmation: z.boolean().optional(),
    completed_date: z.string().optional(),
}).partial();
