-- ============================================================================
-- WARD MANAGEMENT SYSTEM - CLEAN MIGRATION
-- ============================================================================
-- This script will DROP existing tables and recreate them fresh
-- ⚠️ WARNING: This will delete all data in these tables!
-- Only run this if you want a fresh start
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing tables (in correct order due to foreign keys)
-- ============================================================================

DROP TABLE IF EXISTS ot_forms CASCADE;
DROP TABLE IF EXISTS patient_forms CASCADE;
DROP TABLE IF EXISTS ward_patients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS hospital_wards CASCADE;

-- Note: We're NOT dropping the 'doctors' table as it already exists
-- Note: We're NOT dropping the 'wards' table as you want to keep it

-- ============================================================================
-- STEP 2: Create Tables
-- ============================================================================

-- 1. Create hospital_wards table (renamed to avoid conflict with existing wards table)
CREATE TABLE hospital_wards (
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

-- 2. Create ward_patients table
CREATE TABLE ward_patients (
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

-- 3. Create staff table
CREATE TABLE staff (
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

-- 4. Create patient_forms table
CREATE TABLE patient_forms (
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

-- 5. Create ot_forms table
CREATE TABLE ot_forms (
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

-- ============================================================================
-- STEP 3: Create Indexes for Performance
-- ============================================================================

-- Hospital Wards indexes
CREATE INDEX idx_hospital_wards_department ON hospital_wards(department);
CREATE INDEX idx_hospital_wards_floor ON hospital_wards(floor);

-- Ward Patients indexes
CREATE INDEX idx_ward_patients_ward_id ON ward_patients(ward_id);
CREATE INDEX idx_ward_patients_status ON ward_patients(status);
CREATE INDEX idx_ward_patients_admission_date ON ward_patients(admission_date DESC);

-- Staff indexes
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_department ON staff(department);
CREATE INDEX idx_staff_status ON staff(status);

-- Patient Forms indexes
CREATE INDEX idx_patient_forms_patient_id ON patient_forms(patient_id);
CREATE INDEX idx_patient_forms_form_type ON patient_forms(form_type);
CREATE INDEX idx_patient_forms_status ON patient_forms(status);
CREATE INDEX idx_patient_forms_created_at ON patient_forms(created_at DESC);

-- OT Forms indexes
CREATE INDEX idx_ot_forms_patient_id ON ot_forms(patient_id);
CREATE INDEX idx_ot_forms_form_type ON ot_forms(form_type);
CREATE INDEX idx_ot_forms_status ON ot_forms(status);
CREATE INDEX idx_ot_forms_created_at ON ot_forms(created_at DESC);

-- ============================================================================
-- STEP 4: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE hospital_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_forms ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Create RLS Policies (Allow all operations for now)
-- ============================================================================

-- Hospital Wards policies
CREATE POLICY "Enable all operations for hospital_wards" 
ON hospital_wards FOR ALL USING (true) WITH CHECK (true);

-- Ward Patients policies
CREATE POLICY "Enable all operations for ward_patients" 
ON ward_patients FOR ALL USING (true) WITH CHECK (true);

-- Staff policies
CREATE POLICY "Enable all operations for staff" 
ON staff FOR ALL USING (true) WITH CHECK (true);

-- Patient Forms policies
CREATE POLICY "Enable all operations for patient_forms" 
ON patient_forms FOR ALL USING (true) WITH CHECK (true);

-- OT Forms policies
CREATE POLICY "Enable all operations for ot_forms" 
ON ot_forms FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- STEP 6: Create Triggers for Automatic Timestamp Updates
-- ============================================================================

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_hospital_wards_updated_at 
BEFORE UPDATE ON hospital_wards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ward_patients_updated_at 
BEFORE UPDATE ON ward_patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_forms_updated_at 
BEFORE UPDATE ON patient_forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ot_forms_updated_at 
BEFORE UPDATE ON ot_forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: Insert Sample Data
-- ============================================================================

-- Insert sample hospital_wards
INSERT INTO hospital_wards (name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge) VALUES
  ('General Ward A', 1, 20, 0, 20, 'General Medicine', 'Sarah Johnson'),
  ('ICU Ward', 2, 10, 0, 10, 'Critical Care', 'Michael Chen'),
  ('Pediatric Ward', 3, 15, 0, 15, 'Pediatrics', 'Emily Davis'),
  ('Surgical Ward', 2, 18, 0, 18, 'Surgery', 'Robert Martinez');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all tables were created successfully
SELECT 
  'hospital_wards' as table_name, 
  COUNT(*) as row_count 
FROM hospital_wards
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
-- MIGRATION COMPLETE! 
-- ============================================================================
-- Next steps:
-- 1. Your .env file is already updated with new credentials
-- 2. Restart your development server: npm run dev
-- 3. Your application should now connect to the new tables
-- ============================================================================
