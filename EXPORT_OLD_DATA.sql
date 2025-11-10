-- ============================================================================
-- DATA EXPORT SCRIPT - OLD SUPABASE PROJECT
-- ============================================================================
-- Run this in your OLD Supabase project to export existing data
-- Use this BEFORE migrating to the new project if you want to keep your data
-- ============================================================================

-- ============================================================================
-- INSTRUCTIONS:
-- ============================================================================
-- 1. Go to your OLD Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Run each section below ONE AT A TIME
-- 4. Copy the results and save them
-- 5. You can then import this data into your new project
-- ============================================================================

-- ============================================================================
-- EXPORT WARDS DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  name,
  floor,
  total_beds,
  occupied_beds,
  available_beds,
  department,
  nurse_in_charge,
  created_at,
  updated_at
FROM wards
ORDER BY created_at;

-- ============================================================================
-- EXPORT WARD PATIENTS DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  name,
  age,
  gender,
  ward_id,
  bed_number,
  admission_date,
  discharge_date,
  diagnosis,
  status,
  doctor,
  emergency_contact,
  blood_group,
  created_at,
  updated_at
FROM ward_patients
ORDER BY admission_date DESC;

-- ============================================================================
-- EXPORT STAFF DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  name,
  role,
  department,
  specialization,
  phone,
  email,
  shift,
  status,
  created_at,
  updated_at
FROM staff
ORDER BY name;

-- ============================================================================
-- EXPORT DOCTORS DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  name,
  specialization,
  department,
  phone,
  email,
  status,
  created_at,
  updated_at
FROM doctors
ORDER BY name;

-- ============================================================================
-- EXPORT PATIENT FORMS DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  patient_id,
  form_type,
  form_name,
  filled_by,
  filled_by_role,
  form_data,
  file_url,
  notes,
  status,
  created_at,
  updated_at
FROM patient_forms
ORDER BY created_at DESC;

-- ============================================================================
-- EXPORT OT FORMS DATA
-- ============================================================================
-- Run this query and copy the results
SELECT 
  id,
  patient_id,
  form_type,
  form_name,
  filled_by,
  filled_by_role,
  form_data,
  file_url,
  notes,
  status,
  created_at,
  updated_at
FROM ot_forms
ORDER BY created_at DESC;

-- ============================================================================
-- GET RECORD COUNTS
-- ============================================================================
-- Run this to see how much data you have
SELECT 
  'wards' as table_name, 
  COUNT(*) as total_records 
FROM wards
UNION ALL
SELECT 
  'ward_patients', 
  COUNT(*) 
FROM ward_patients
UNION ALL
SELECT 
  'staff', 
  COUNT(*) 
FROM staff
UNION ALL
SELECT 
  'doctors', 
  COUNT(*) 
FROM doctors
UNION ALL
SELECT 
  'patient_forms', 
  COUNT(*) 
FROM patient_forms
UNION ALL
SELECT 
  'ot_forms', 
  COUNT(*) 
FROM ot_forms;

-- ============================================================================
-- ALTERNATIVE: EXPORT AS INSERT STATEMENTS
-- ============================================================================
-- If you prefer, you can generate INSERT statements to run in the new project
-- This is more advanced but allows for easier import

-- Example for wards (modify for other tables):
/*
SELECT 
  'INSERT INTO wards (id, name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge, created_at, updated_at) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || name || ''', ' ||
  floor || ', ' ||
  total_beds || ', ' ||
  occupied_beds || ', ' ||
  available_beds || ', ' ||
  '''' || department || ''', ' ||
  '''' || nurse_in_charge || ''', ' ||
  '''' || created_at || ''', ' ||
  '''' || updated_at || ''');'
FROM wards;
*/

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Save all exported data in a safe location
-- 2. You can use the Table Editor's CSV export feature as an alternative
-- 3. When importing to new project, maintain the same UUIDs to preserve relationships
-- 4. Import in this order: wards → doctors → ward_patients → staff → patient_forms → ot_forms
-- ============================================================================
