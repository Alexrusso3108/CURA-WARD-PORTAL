-- Add form_id column to patient_forms and ot_forms tables
-- This column stores the form template ID for retrieving the form structure

-- Add form_id to patient_forms
ALTER TABLE patient_forms ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Add form_id to ot_forms
ALTER TABLE ot_forms ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_id ON patient_forms(form_id);
CREATE INDEX IF NOT EXISTS idx_ot_forms_form_id ON ot_forms(form_id);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('patient_forms', 'ot_forms')
ORDER BY table_name, ordinal_position;
