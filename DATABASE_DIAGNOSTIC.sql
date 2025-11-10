-- ============================================================================
-- DATABASE DIAGNOSTIC SCRIPT
-- ============================================================================
-- Run this in your Supabase SQL Editor to analyze your database
-- Copy the results and share them so I can understand your database structure
-- ============================================================================

-- ============================================================================
-- 1. LIST ALL TABLES
-- ============================================================================
SELECT 
  '=== ALL TABLES ===' as info,
  tablename as table_name,
  schemaname as schema
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 2. TABLE DETAILS WITH COLUMN COUNT
-- ============================================================================
SELECT 
  '=== TABLE DETAILS ===' as info,
  t.tablename as table_name,
  COUNT(c.column_name) as column_count,
  pg_size_pretty(pg_total_relation_size(quote_ident(t.tablename)::regclass)) as table_size
FROM pg_tables t
LEFT JOIN information_schema.columns c 
  ON c.table_name = t.tablename 
  AND c.table_schema = t.schemaname
WHERE t.schemaname = 'public'
GROUP BY t.tablename
ORDER BY t.tablename;

-- ============================================================================
-- 3. COLUMNS FOR EACH TABLE
-- ============================================================================
SELECT 
  '=== COLUMNS ===' as info,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================================================
-- 4. FOREIGN KEY RELATIONSHIPS
-- ============================================================================
SELECT 
  '=== FOREIGN KEYS ===' as info,
  tc.table_name as from_table,
  kcu.column_name as from_column,
  ccu.table_name as to_table,
  ccu.column_name as to_column,
  tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================================================
-- 5. PRIMARY KEYS
-- ============================================================================
SELECT 
  '=== PRIMARY KEYS ===' as info,
  tc.table_name,
  kcu.column_name as primary_key_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ============================================================================
-- 6. INDEXES
-- ============================================================================
SELECT 
  '=== INDEXES ===' as info,
  tablename as table_name,
  indexname as index_name,
  indexdef as index_definition
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- 7. ROW LEVEL SECURITY STATUS
-- ============================================================================
SELECT 
  '=== RLS STATUS ===' as info,
  schemaname as schema,
  tablename as table_name,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 8. RLS POLICIES
-- ============================================================================
SELECT 
  '=== RLS POLICIES ===' as info,
  schemaname as schema,
  tablename as table_name,
  policyname as policy_name,
  permissive,
  roles,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================
SELECT 
  '=== TRIGGERS ===' as info,
  trigger_schema as schema,
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event,
  action_timing as timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- 10. RECORD COUNTS FOR EACH TABLE
-- ============================================================================
-- This shows how much data is in each table
SELECT 
  '=== RECORD COUNTS ===' as info,
  'wards' as table_name,
  COUNT(*) as record_count
FROM wards
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'wards' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'hospital_wards',
  COUNT(*)
FROM hospital_wards
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'hospital_wards' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'ward_patients',
  COUNT(*)
FROM ward_patients
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'ward_patients' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'doctors',
  COUNT(*)
FROM doctors
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'doctors' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'staff',
  COUNT(*)
FROM staff
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'staff' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'patient_forms',
  COUNT(*)
FROM patient_forms
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'patient_forms' AND schemaname = 'public')
UNION ALL
SELECT 
  '=== RECORD COUNTS ===',
  'ot_forms',
  COUNT(*)
FROM ot_forms
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'ot_forms' AND schemaname = 'public');

-- ============================================================================
-- 11. SPECIFIC CHECK: ward_patients TABLE STRUCTURE
-- ============================================================================
SELECT 
  '=== WARD_PATIENTS STRUCTURE ===' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'ward_patients'
ORDER BY ordinal_position;

-- ============================================================================
-- 12. CHECK FOR CONFLICTING TABLES
-- ============================================================================
SELECT 
  '=== POTENTIAL CONFLICTS ===' as info,
  tablename as table_name,
  'Exists' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('wards', 'hospital_wards', 'ward_patients', 'patient_forms', 'ot_forms', 'staff', 'doctors')
ORDER BY tablename;

-- ============================================================================
-- DIAGNOSTIC COMPLETE
-- ============================================================================
-- Copy ALL the results above and share them
-- This will help me understand your database structure completely
-- ============================================================================
