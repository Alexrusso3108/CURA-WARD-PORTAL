-- Step 2: Create Patients Table
-- Copy and paste this into Supabase SQL Editor and click RUN

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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_ward_id ON patients(ward_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Enable all operations for patients" 
ON patients 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_patients_updated_at 
BEFORE UPDATE ON patients
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT * FROM patients;
