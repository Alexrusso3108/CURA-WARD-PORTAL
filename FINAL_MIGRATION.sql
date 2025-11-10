-- ============================================================================
-- FINAL MIGRATION SCRIPT - RUN THIS COMPLETE SCRIPT
-- ============================================================================
-- This is safe to run all at once
-- It creates tables in the correct order without verification queries
-- ============================================================================

-- Create hospital_wards table
CREATE TABLE IF NOT EXISTS hospital_wards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  floor INTEGER NOT NULL,
  total_beds INTEGER NOT NULL,
  occupied_beds INTEGER NOT NULL DEFAULT 0,
  available_beds INTEGER NOT NULL,
  department TEXT NOT NULL,
  nurse_in_charge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ward_patients table
CREATE TABLE IF NOT EXISTS ward_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  ward_id UUID REFERENCES hospital_wards(id) ON DELETE SET NULL,
  bed_number TEXT NOT NULL,
  admission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discharge_date TIMESTAMP WITH TIME ZONE,
  diagnosis TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Admitted',
  doctor TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  shift TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_forms table
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

-- Create ot_forms table
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
CREATE INDEX IF NOT EXISTS idx_hospital_wards_department ON hospital_wards(department);
CREATE INDEX IF NOT EXISTS idx_hospital_wards_floor ON hospital_wards(floor);
CREATE INDEX IF NOT EXISTS idx_ward_patients_ward_id ON ward_patients(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_patients_status ON ward_patients(status);
CREATE INDEX IF NOT EXISTS idx_ward_patients_admission_date ON ward_patients(admission_date DESC);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_patient_forms_patient_id ON patient_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_type ON patient_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_patient_forms_status ON patient_forms(status);
CREATE INDEX IF NOT EXISTS idx_patient_forms_created_at ON patient_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ot_forms_patient_id ON ot_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_ot_forms_form_type ON ot_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_ot_forms_status ON ot_forms(status);
CREATE INDEX IF NOT EXISTS idx_ot_forms_created_at ON ot_forms(created_at DESC);

-- Enable RLS
ALTER TABLE hospital_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Enable all operations for hospital_wards" ON hospital_wards;
CREATE POLICY "Enable all operations for hospital_wards" ON hospital_wards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for ward_patients" ON ward_patients;
CREATE POLICY "Enable all operations for ward_patients" ON ward_patients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for staff" ON staff;
CREATE POLICY "Enable all operations for staff" ON staff FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for patient_forms" ON patient_forms;
CREATE POLICY "Enable all operations for patient_forms" ON patient_forms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all operations for ot_forms" ON ot_forms;
CREATE POLICY "Enable all operations for ot_forms" ON ot_forms FOR ALL USING (true) WITH CHECK (true);

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hospital_wards_updated_at ON hospital_wards;
CREATE TRIGGER update_hospital_wards_updated_at BEFORE UPDATE ON hospital_wards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ward_patients_updated_at ON ward_patients;
CREATE TRIGGER update_ward_patients_updated_at BEFORE UPDATE ON ward_patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_forms_updated_at ON patient_forms;
CREATE TRIGGER update_patient_forms_updated_at BEFORE UPDATE ON patient_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ot_forms_updated_at ON ot_forms;
CREATE TRIGGER update_ot_forms_updated_at BEFORE UPDATE ON ot_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO hospital_wards (name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge)
SELECT * FROM (VALUES
  ('General Ward A', 1, 20, 0, 20, 'General Medicine', 'Sarah Johnson'),
  ('ICU Ward', 2, 10, 0, 10, 'Critical Care', 'Michael Chen'),
  ('Pediatric Ward', 3, 15, 0, 15, 'Pediatrics', 'Emily Davis'),
  ('Surgical Ward', 2, 18, 0, 18, 'Surgery', 'Robert Martinez')
) AS v(name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge)
WHERE NOT EXISTS (SELECT 1 FROM hospital_wards LIMIT 1);
