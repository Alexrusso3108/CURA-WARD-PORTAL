-- Step 5: Create OT Forms Table
-- This table tracks OT (Operation Theatre) forms filled for each patient

CREATE TABLE IF NOT EXISTS ot_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES ward_patients(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,
  form_name TEXT NOT NULL,
  filled_by TEXT NOT NULL,
  filled_by_role TEXT NOT NULL,
  form_data JSONB,
  file_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ot_forms_patient_id ON ot_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_ot_forms_form_type ON ot_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_ot_forms_status ON ot_forms(status);
CREATE INDEX IF NOT EXISTS idx_ot_forms_created_at ON ot_forms(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ot_forms ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all operations for ot_forms" 
ON ot_forms 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger
CREATE TRIGGER update_ot_forms_updated_at 
BEFORE UPDATE ON ot_forms
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify
SELECT * FROM ot_forms;
