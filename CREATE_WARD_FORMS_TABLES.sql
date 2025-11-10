-- ============================================================================
-- CREATE WARD MANAGEMENT FORMS TABLES (UNIQUE NAMES)
-- ============================================================================
-- Safe to run - won't affect existing patient_forms or ot_forms tables
-- ============================================================================

-- Create ward_patient_forms table (unique name)
CREATE TABLE IF NOT EXISTS ward_patient_forms (
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

-- Create ward_ot_forms table (unique name)
CREATE TABLE IF NOT EXISTS ward_ot_forms (
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
CREATE INDEX IF NOT EXISTS idx_ward_patient_forms_patient_id ON ward_patient_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_ward_patient_forms_form_type ON ward_patient_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_ward_patient_forms_status ON ward_patient_forms(status);
CREATE INDEX IF NOT EXISTS idx_ward_patient_forms_created_at ON ward_patient_forms(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ward_ot_forms_patient_id ON ward_ot_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_ward_ot_forms_form_type ON ward_ot_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_ward_ot_forms_status ON ward_ot_forms(status);
CREATE INDEX IF NOT EXISTS idx_ward_ot_forms_created_at ON ward_ot_forms(created_at DESC);

-- Enable RLS
ALTER TABLE ward_patient_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_ot_forms ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Enable all operations for ward_patient_forms" ON ward_patient_forms;
CREATE POLICY "Enable all operations for ward_patient_forms" ON ward_patient_forms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for ward_ot_forms" ON ward_ot_forms;
CREATE POLICY "Enable all operations for ward_ot_forms" ON ward_ot_forms FOR ALL USING (true) WITH CHECK (true);

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ward_patient_forms_updated_at ON ward_patient_forms;
CREATE TRIGGER update_ward_patient_forms_updated_at BEFORE UPDATE ON ward_patient_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ward_ot_forms_updated_at ON ward_ot_forms;
CREATE TRIGGER update_ward_ot_forms_updated_at BEFORE UPDATE ON ward_ot_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reload schema
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- DONE! New tables created with unique names
-- ============================================================================
