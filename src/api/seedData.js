/**
 * Demo seed data for local development.
 * Used by the mock Base44 client when no real backend is available.
 */

const MAIN_SCHOOL = {
    id: 'sch_001',
    name: 'Baliwasan Senior High School - Stand-Alone',
    address: 'San Jose Road, Baliwasan, Zamboanga City',
    principal_name: 'Principal Maria',
    contact_email: 'principal@baliwasan-shs.edu.ph',
    contact_number: '0917-123-4444',
    division: 'Zamboanga City',
    created_date: '2025-01-15T08:00:00Z'
};

export const DEMO_USERS = [
    {
        id: 'user_admin_001',
        email: 'deped.supervisor@assetlink.ph',
        full_name: 'DepEd Supervisor Roberto',
        role: 'admin', // Internal role remains 'admin' for logic compatibility
        created_date: '2025-01-15T08:00:00Z',
    },
    {
        id: 'user_teacher_001',
        email: 'teacher@baliwasan-shs.edu.ph',
        full_name: 'Juan Dela Cruz',
        role: 'teacher',
        school_id: MAIN_SCHOOL.id,
        school_name: MAIN_SCHOOL.name,
        created_date: '2025-01-15T08:00:00Z',
    },
    {
        id: 'user_principal_001',
        email: 'principal@baliwasan-shs.edu.ph',
        full_name: 'Principal Maria',
        role: 'principal',
        school_id: MAIN_SCHOOL.id,
        school_name: MAIN_SCHOOL.name,
        created_date: '2025-01-15T08:00:00Z',
    },
    {
        id: 'user_barangay_001',
        email: 'barangay.official@baliwasan.gov.ph',
        full_name: 'Hon. Barangay Kagawad',
        role: 'supervisor', // Internal role remains 'supervisor' for logic compatibility
        school_id: MAIN_SCHOOL.id,
        school_name: MAIN_SCHOOL.name,
        created_date: '2025-01-15T08:00:00Z',
    },
    {
        id: 'user_maintenance_001',
        email: 'maintenance@baliwasan-shs.edu.ph',
        full_name: 'Maintenance Staff Pedro',
        role: 'maintenance',
        school_id: MAIN_SCHOOL.id,
        school_name: MAIN_SCHOOL.name,
        created_date: '2025-01-15T08:00:00Z',
    }
];

// Fallback for mock backend initial setup if needed
export const DEMO_USER = DEMO_USERS[0];

export const SEED_SCHOOLS = [
    MAIN_SCHOOL,
    { id: 'sch_002', name: 'Zamboanga City High School (Main)', address: 'Don Alfaro St, Tetuan, Zamboanga City', principal_name: 'Jose Reyes', contact_email: 'jreyes@deped.gov.ph', contact_number: '0918-234-5678', division: 'Zamboanga City', created_date: '2025-02-10T08:00:00Z' },
];

export const SEED_ASSETS = [
    { id: 'ast_001', name: 'Student Armchair (Monoblock)', asset_code: 'CHR-001', category: 'Furniture', condition: 'Good', location: 'Room 101', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Standard student monoblock armchair', is_active: true, created_date: '2025-02-01T08:00:00Z' },
    { id: 'ast_002', name: 'Teacher\'s Desk (Wooden)', asset_code: 'DSK-001', category: 'Furniture', condition: 'Fair', location: 'Room 102', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Wooden teacher desk with drawer', is_active: true, created_date: '2025-02-01T08:00:00Z' },
    { id: 'ast_003', name: 'LCD Projector (Epson)', asset_code: 'PRJ-001', category: 'Electronics', condition: 'Excellent', location: 'AVR', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Epson EB-X51 LCD Projector', is_active: true, created_date: '2025-02-15T08:00:00Z' },
    { id: 'ast_004', name: 'Desktop Computer', asset_code: 'PC-001', category: 'Electronics', condition: 'Good', location: 'Computer Lab', school_id: 'sch_002', school_name: 'Zamboanga City High School (Main)', description: 'Desktop PC for computer lab', is_active: true, created_date: '2025-03-01T08:00:00Z' },
    { id: 'ast_009', name: 'Library Bookshelf', asset_code: 'SHF-001', category: 'Furniture', condition: 'Excellent', location: 'Library', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Steel bookshelf 5-layer', is_active: true, created_date: '2025-04-15T08:00:00Z' },
    { id: 'ast_010', name: 'Ceiling Fan', asset_code: 'FAN-001', category: 'Appliances', condition: 'Condemned', location: 'Room 103', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, description: 'Industrial ceiling fan', is_active: true, created_date: '2025-05-01T08:00:00Z' },
];

export const SEED_REPAIR_REQUESTS = [
    { id: 'rr_001', request_number: 'RR-100001', asset_id: 'ast_002', asset_name: 'Teacher\'s Desk (Wooden)', asset_code: 'DSK-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, reported_by_email: 'teacher@baliwasan-shs.edu.ph', reported_by_name: 'Juan Dela Cruz', description: 'Drawer handle broken, difficult to open. Splinters on the edge.', priority: 'Medium', status: 'Pending', created_date: '2025-11-20T08:00:00Z' },
    { id: 'rr_004', request_number: 'RR-100004', asset_id: 'ast_010', asset_name: 'Ceiling Fan', asset_code: 'FAN-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, reported_by_email: 'teacher@baliwasan-shs.edu.ph', reported_by_name: 'Juan Dela Cruz', description: 'Fan making loud grinding noise, blades wobbling dangerously. Safety hazard for students.', priority: 'Critical', status: 'Escalated', created_date: '2025-11-10T08:00:00Z', escalated_reason: 'Requires budget approval for replacement' },
    { id: 'rr_006', request_number: 'RR-100006', asset_id: 'ast_001', asset_name: 'Student Armchair (Monoblock)', asset_code: 'CHR-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, reported_by_email: 'teacher@baliwasan-shs.edu.ph', reported_by_name: 'Juan Dela Cruz', description: 'Armrest snapped off, chair is unstable.', priority: 'Low', status: 'Completed', created_date: '2025-09-12T08:00:00Z', completed_date: '2025-09-18T08:00:00Z' },
    { id: 'rr_007', request_number: 'RR-100007', asset_id: 'ast_003', asset_name: 'LCD Projector (Epson)', asset_code: 'PRJ-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, reported_by_email: 'teacher@baliwasan-shs.edu.ph', reported_by_name: 'Maria Reyes', description: 'Projector light bulb burned out. No display output.', priority: 'High', status: 'In Progress', created_date: '2025-12-01T08:00:00Z', teacher_confirmation: false },
];

export const SEED_TASKS = [
    { id: 'tsk_001', asset_id: 'ast_002', asset_name: 'Teacher\'s Desk (Wooden)', asset_code: 'DSK-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, repair_request_id: 'rr_001', assigned_to_email: 'maintenance@baliwasan-shs.edu.ph', assigned_to_name: 'Maintenance Staff Pedro', status: 'Assigned', priority: 'Medium', notes: 'Replace drawer handle and sand down splinters', created_date: '2025-11-21T08:00:00Z' },
    { id: 'tsk_004', asset_id: 'ast_001', asset_name: 'Student Armchair (Monoblock)', asset_code: 'CHR-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, repair_request_id: 'rr_006', assigned_to_email: 'maintenance@baliwasan-shs.edu.ph', assigned_to_name: 'Maintenance Staff Pedro', status: 'Completed', priority: 'Low', notes: 'Replaced with spare chair from storage', created_date: '2025-09-13T08:00:00Z', completed_date: '2025-09-18T08:00:00Z' },
    { id: 'tsk_005', asset_id: 'ast_003', asset_name: 'LCD Projector (Epson)', asset_code: 'PRJ-001', school_id: MAIN_SCHOOL.id, school_name: MAIN_SCHOOL.name, repair_request_id: 'rr_007', assigned_to_email: 'maintenance@baliwasan-shs.edu.ph', assigned_to_name: 'Maintenance Staff Pedro', status: 'Pending Teacher Verification', priority: 'High', notes: 'Replaced light bulb and tested connectivity', created_date: '2025-12-01T08:00:00Z', verified_by_email: null, teacher_confirmation: false },
];
