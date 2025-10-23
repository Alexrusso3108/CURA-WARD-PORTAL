-- Step 3: Create Staff Table
-- Copy and paste this into Supabase SQL Editor and click RUN

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
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Enable all operations for staff" 
ON staff 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_staff_updated_at 
BEFORE UPDATE ON staff
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample staff data
INSERT INTO staff (name, role, department, specialization, phone, email, shift, status) VALUES
  ('Dr. Sarah Johnson', 'Doctor', 'General Medicine', 'Internal Medicine', '+1-555-0101', 'sarah.johnson@hospital.com', 'Morning', 'Active'),
  ('Dr. Michael Chen', 'Doctor', 'Critical Care', 'Intensive Care', '+1-555-0102', 'michael.chen@hospital.com', 'Evening', 'Active'),
  ('Dr. Emily Davis', 'Doctor', 'Pediatrics', 'Child Health', '+1-555-0103', 'emily.davis@hospital.com', 'Morning', 'Active'),
  ('Dr. Robert Martinez', 'Doctor', 'Surgery', 'General Surgery', '+1-555-0104', 'robert.martinez@hospital.com', 'Night', 'Active'),
  ('Nurse Jennifer Lee', 'Nurse', 'General Medicine', 'General Nursing', '+1-555-0201', 'jennifer.lee@hospital.com', 'Morning', 'Active'),
  ('Nurse David Brown', 'Nurse', 'Critical Care', 'ICU Nursing', '+1-555-0202', 'david.brown@hospital.com', 'Evening', 'Active'),
  ('Nurse Lisa Anderson', 'Nurse', 'Pediatrics', 'Pediatric Nursing', '+1-555-0203', 'lisa.anderson@hospital.com', 'Night', 'Active'),
  ('Nurse James Wilson', 'Nurse', 'Surgery', 'Surgical Nursing', '+1-555-0204', 'james.wilson@hospital.com', 'Morning', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Verify the table was created
SELECT * FROM staff ORDER BY role, name;
