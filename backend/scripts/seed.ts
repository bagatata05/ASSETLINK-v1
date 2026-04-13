import { db } from '../src/db/index.ts';
import { schools, users, assets } from '../src/db/schema.ts';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MAIN_SCHOOL = {
    id: 'sch_001',
    name: 'Baliwasan Senior High School - Stand-Alone',
    address: 'San Jose Road, Baliwasan, Zamboanga City',
    principal_name: 'Principal Maria',
    contact_email: 'principal@baliwasan-shs.edu.ph',
    contact_phone: '0917-123-4444',
    division: 'Zamboanga City',
};

const SEED_USERS = [
    { id: 'user_admin_001', email: 'deped.supervisor@assetlink.ph', full_name: 'DepEd Supervisor Roberto', role: 'admin' },
    { id: 'user_teacher_001', email: 'teacher@baliwasan-shs.edu.ph', full_name: 'Juan Dela Cruz', role: 'teacher', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name },
    { id: 'user_principal_001', email: 'principal@baliwasan-shs.edu.ph', full_name: 'Principal Maria', role: 'principal', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name },
    { id: 'user_barangay_001', email: 'barangay.official@baliwasan.gov.ph', full_name: 'Hon. Barangay Kagawad', role: 'supervisor', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name },
    { id: 'user_maintenance_001', email: 'maintenance@baliwasan-shs.edu.ph', full_name: 'Maintenance Staff Pedro', role: 'maintenance', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name }
];

const SEED_ASSETS = [
    { id: 'ast_001', name: 'Student Armchair (Monoblock)', asset_code: 'CHR-001', category: 'Furniture', condition: 'Good', location: 'Room 101', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Standard student monoblock armchair' },
    { id: 'ast_002', name: 'Teacher\'s Desk (Wooden)', asset_code: 'DSK-001', category: 'Furniture', condition: 'Fair', location: 'Room 102', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Wooden teacher desk with drawer' },
    { id: 'ast_003', name: 'LCD Projector (Epson)', asset_code: 'PRJ-001', category: 'Electronics', condition: 'Excellent', location: 'AVR', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Epson EB-X51 LCD Projector' },
];

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Clear existing data to allow re-seeding
        console.log('🧹 Cleaning up old data...');
        await db.delete(assets);
        await db.delete(users);
        await db.delete(schools);

        await db.insert(schools).values(MAIN_SCHOOL);
        console.log('✓ Schools seeded');

        await db.insert(users).values(SEED_USERS);
        console.log('✓ Users seeded');

        await db.insert(assets).values(SEED_ASSETS);
        console.log('✓ Assets seeded');

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
