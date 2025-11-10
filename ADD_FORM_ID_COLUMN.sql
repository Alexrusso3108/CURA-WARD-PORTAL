-- ============================================================================
-- ADD MISSING COLUMNS TO WARD FORMS TABLES
-- ============================================================================

-- Add form_id column to ward_patient_forms
ALTER TABLE ward_patient_forms 
ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Add form_id column to ward_ot_forms
ALTER TABLE ward_ot_forms 
ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Reload schema
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- DONE! form_id column added
-- ============================================================================
