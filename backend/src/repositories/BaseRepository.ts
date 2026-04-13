import { MySqlTable } from 'drizzle-orm/mysql-core';
import { db } from '../db';
import { eq, sql } from 'drizzle-orm';

export abstract class BaseRepository<T extends MySqlTable> {
    constructor(protected table: T) {}

    async findAll() {
        return await db.select().from(this.table);
    }

    async findById(id: string) {
        // @ts-ignore
        return (await db.select().from(this.table).where(eq(this.table.id, id)))[0];
    }

    async findWithFilters(filters: Record<string, any>) {
        const { sort, limit, ...queryFilters } = filters;
        let query = db.select().from(this.table);
        
        if (Object.keys(queryFilters).length > 0) {
            const conditions: any[] = [];
            Object.entries(queryFilters).forEach(([key, value]) => {
                // @ts-ignore
                if (this.table[key] && value !== undefined && value !== null && value !== '') {
                    // @ts-ignore
                    conditions.push(eq(this.table[key], value));
                }
            });
            
            if (conditions.length > 0) {
                // @ts-ignore
                query = query.where(sql.join(conditions, sql` AND `));
            }
        }
        
        // Handle sorting if provided
        if (sort) {
            const desc = sort.startsWith('-');
            const field = desc ? sort.substring(1) : sort;
            // @ts-ignore
            if (this.table[field]) {
                // @ts-ignore
                query = query.orderBy(desc ? sql`${this.table[field]} DESC` : sql`${this.table[field]} ASC`);
            }
        }

        // Handle limit if provided
        if (limit) {
            query = query.limit(Number(limit));
        }
        
        return await query;
    }

    async create(data: any) {
        await db.insert(this.table).values(data);
        return data;
    }

    async update(id: string, data: any) {
        // @ts-ignore
        await db.update(this.table).set(data).where(eq(this.table.id, id));
        return { id, ...data };
    }

    async delete(id: string) {
        // @ts-ignore
        await db.delete(this.table).where(eq(this.table.id, id));
        return { id };
    }
}
