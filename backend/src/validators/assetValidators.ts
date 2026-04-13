import { z } from 'zod';

export const createAssetSchema = z.object({
    name: z.string().min(3).max(255),
    asset_code: z.string().min(3).max(50),
    category: z.string().min(2).max(100),
    condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'Condemned']),
    location: z.string().optional(),
    description: z.string().optional(),
    serial_number: z.string().optional(),
    purchase_date: z.string().optional(),
    purchase_value: z.number().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();
