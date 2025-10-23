-- Hospital Ward Management System Database Schema
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Create wards table
CREATE TABLE IF NOT EXISTS wards (
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

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  ward_id UUID REFERENCES wards(id) ON DELETE SET NULL,
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_ward_id ON patients(ward_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);

-- Enable Row Level Security (RLS)
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can customize these based on your needs)
CREATE POLICY "Enable all operations for wards" ON wards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_wards_updated_at BEFORE UPDATE ON wards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for wards
INSERT INTO wards (name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge) VALUES
  ('General Ward A', 1, 20, 15, 5, 'General Medicine', 'Sarah Johnson'),
  ('ICU Ward', 2, 10, 8, 2, 'Critical Care', 'Michael Chen'),
  ('Pediatric Ward', 3, 15, 10, 5, 'Pediatrics', 'Emily Davis'),
  ('Surgical Ward', 2, 18, 12, 6, 'Surgery', 'Robert Martinez')
ON CONFLICT DO NOTHING;

-- Note: You'll need to get the ward IDs after inserting to use them in patients
-- For now, we'll skip inserting sample patients and staff
-- You can add them through the application interface after setup
