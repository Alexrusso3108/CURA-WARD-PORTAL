-- Step 4: Create Patient Forms Table
-- This table tracks monitoring forms filled for each patient

CREATE TABLE IF NOT EXISTS patient_forms (
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
CREATE INDEX IF NOT EXISTS idx_patient_forms_patient_id ON patient_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_type ON patient_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_patient_forms_status ON patient_forms(status);
CREATE INDEX IF NOT EXISTS idx_patient_forms_created_at ON patient_forms(created_at DESC);

-- Enable Row Level Security
ALTER TABLE patient_forms ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable all operations for patient_forms" 
ON patient_forms 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger
CREATE TRIGGER update_patient_forms_updated_at 
BEFORE UPDATE ON patient_forms
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify
SELECT * FROM patient_forms;
