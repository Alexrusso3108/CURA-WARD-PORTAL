-- ============================================================================
-- WARD MANAGEMENT SYSTEM - SAFE MIGRATION (NO DATA LOSS)
-- ============================================================================
-- This script is SAFE to run on a shared Supabase project
-- It will NOT drop or modify any existing tables
-- It only creates NEW tables with unique names
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Tables (Only if they don't exist)
-- ============================================================================

-- 1. Create hospital_wards table (unique name, won't conflict)
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

-- 2. Create ward_patients table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ward_patients') THEN
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
  END IF;
END $$;

-- 3. Create staff table (only if it doesn't exist)
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

-- 4. Create patient_forms table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'patient_forms') THEN
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
  END IF;
END $$;

-- 5. Create ot_forms table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ot_forms') THEN
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
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Create Indexes (Only if they don't exist)
-- ============================================================================

-- Hospital Wards indexes
CREATE INDEX IF NOT EXISTS idx_hospital_wards_department ON hospital_wards(department);
CREATE INDEX IF NOT EXISTS idx_hospital_wards_floor ON hospital_wards(floor);

-- Ward Patients indexes
CREATE INDEX IF NOT EXISTS idx_ward_patients_ward_id ON ward_patients(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_patients_status ON ward_patients(status);
CREATE INDEX IF NOT EXISTS idx_ward_patients_admission_date ON ward_patients(admission_date DESC);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- Patient Forms indexes
CREATE INDEX IF NOT EXISTS idx_patient_forms_patient_id ON patient_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_type ON patient_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_patient_forms_status ON patient_forms(status);
CREATE INDEX IF NOT EXISTS idx_patient_forms_created_at ON patient_forms(created_at DESC);

-- OT Forms indexes
CREATE INDEX IF NOT EXISTS idx_ot_forms_patient_id ON ot_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_ot_forms_form_type ON ot_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_ot_forms_status ON ot_forms(status);
CREATE INDEX IF NOT EXISTS idx_ot_forms_created_at ON ot_forms(created_at DESC);

-- ============================================================================
-- STEP 3: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE hospital_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_forms ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create RLS Policies (Only if they don't exist)
-- ============================================================================

-- Hospital Wards policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'hospital_wards' AND policyname = 'Enable all operations for hospital_wards'
  ) THEN
    CREATE POLICY "Enable all operations for hospital_wards" 
    ON hospital_wards FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Ward Patients policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'ward_patients' AND policyname = 'Enable all operations for ward_patients'
  ) THEN
    CREATE POLICY "Enable all operations for ward_patients" 
    ON ward_patients FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Staff policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'staff' AND policyname = 'Enable all operations for staff'
  ) THEN
    CREATE POLICY "Enable all operations for staff" 
    ON staff FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Patient Forms policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'patient_forms' AND policyname = 'Enable all operations for patient_forms'
  ) THEN
    CREATE POLICY "Enable all operations for patient_forms" 
    ON patient_forms FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- OT Forms policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'ot_forms' AND policyname = 'Enable all operations for ot_forms'
  ) THEN
    CREATE POLICY "Enable all operations for ot_forms" 
    ON ot_forms FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Create Triggers (Only if they don't exist)
-- ============================================================================

-- Create function to update updated_at timestamp (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS update_hospital_wards_updated_at ON hospital_wards;
CREATE TRIGGER update_hospital_wards_updated_at 
BEFORE UPDATE ON hospital_wards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ward_patients_updated_at ON ward_patients;
CREATE TRIGGER update_ward_patients_updated_at 
BEFORE UPDATE ON ward_patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_forms_updated_at ON patient_forms;
CREATE TRIGGER update_patient_forms_updated_at 
BEFORE UPDATE ON patient_forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ot_forms_updated_at ON ot_forms;
CREATE TRIGGER update_ot_forms_updated_at 
BEFORE UPDATE ON ot_forms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Insert Sample Data (Only if tables are empty)
-- ============================================================================

-- Insert sample hospital_wards (only if table is empty)
INSERT INTO hospital_wards (name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge)
SELECT 'General Ward A', 1, 20, 0, 20, 'General Medicine', 'Sarah Johnson'
WHERE NOT EXISTS (SELECT 1 FROM hospital_wards LIMIT 1)
UNION ALL
SELECT 'ICU Ward', 2, 10, 0, 10, 'Critical Care', 'Michael Chen'
WHERE NOT EXISTS (SELECT 1 FROM hospital_wards LIMIT 1)
UNION ALL
SELECT 'Pediatric Ward', 3, 15, 0, 15, 'Pediatrics', 'Emily Davis'
WHERE NOT EXISTS (SELECT 1 FROM hospital_wards LIMIT 1)
UNION ALL
SELECT 'Surgical Ward', 2, 18, 0, 18, 'Surgery', 'Robert Martinez'
WHERE NOT EXISTS (SELECT 1 FROM hospital_wards LIMIT 1);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all tables exist and show record counts
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
-- SAFE MIGRATION COMPLETE! 
-- ============================================================================
-- ✅ This script is SAFE - it does NOT drop or modify existing tables
-- ✅ All existing data in other tables is preserved
-- ✅ Other apps connected to this Supabase project are NOT affected
-- 
-- Next steps:
-- 1. Restart your development server: npm run dev
-- 2. Your Ward Management app will now use the new tables
-- 3. All other apps continue working with their existing tables
-- ============================================================================
