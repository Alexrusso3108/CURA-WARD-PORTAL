-- ============================================================================
-- DATABASE DIAGNOSTIC SCRIPT (SAFE VERSION)
-- ============================================================================
-- This version won't error on missing tables
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. LIST ALL TABLES
-- ============================================================================
SELECT 
  tablename as table_name,
  schemaname as schema
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 2. COLUMNS FOR EACH TABLE
-- ============================================================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================================================
-- 3. FOREIGN KEY RELATIONSHIPS
-- ============================================================================
SELECT 
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
-- 4. CHECK WHICH TABLES EXIST
-- ============================================================================
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'wards' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as wards_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'hospital_wards' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as hospital_wards_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'ward_patients' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as ward_patients_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'doctors' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as doctors_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'staff' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as staff_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'patient_forms' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as patient_forms_status,
  CASE 
    WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'ot_forms' AND schemaname = 'public')
    THEN 'EXISTS' ELSE 'MISSING'
  END as ot_forms_status;

-- ============================================================================
-- DIAGNOSTIC COMPLETE
-- ============================================================================
-- Share the results from all 4 queries above
-- ============================================================================
