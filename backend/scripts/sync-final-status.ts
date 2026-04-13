import { db } from '../src/db';
import { repairRequests, maintenanceTasks } from '../src/db/schema';
import { eq, inArray } from 'drizzle-orm';

async function syncStatuses() {
    console.log('🔄 Reconciling Status Boards...');

    // 1. Find all Maintenance Tasks that are finished/awaiting verification
    const finishedTasks = await db.select()
        .from(maintenanceTasks)
        .where(
            inArray(maintenanceTasks.status, ['Pending Teacher Verification', 'Completed'])
        );

    console.log(`🔍 Found ${finishedTasks.length} maintenance tasks ready for verification.`);

    for (const task of finishedTasks) {
        if (task.repair_request_id) {
            console.log(`📡 Aligning Repair Request: ${task.request_number}...`);
            await db.update(repairRequests)
                .set({ status: 'Pending Verification' })
                .where(eq(repairRequests.id, task.repair_request_id));
        }
    }

    console.log('✅ Synchronization Complete! The Teacher\'s board is now awake.');
    process.exit(0);
}

syncStatuses().catch(err => {
    console.error('❌ Sync Failed:', err);
    process.exit(1);
});
