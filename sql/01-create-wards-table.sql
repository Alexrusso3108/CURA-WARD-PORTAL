-- Step 1: Create Wards Table
-- Copy and paste this into Supabase SQL Editor and click RUN

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

-- Enable Row Level Security (RLS)
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this later)
CREATE POLICY "Enable all operations for wards" 
ON wards 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wards_updated_at 
BEFORE UPDATE ON wards
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample wards data
INSERT INTO wards (name, floor, total_beds, occupied_beds, available_beds, department, nurse_in_charge) VALUES
  ('General Ward A', 1, 20, 15, 5, 'General Medicine', 'Sarah Johnson'),
  ('ICU Ward', 2, 10, 8, 2, 'Critical Care', 'Michael Chen'),
  ('Pediatric Ward', 3, 15, 10, 5, 'Pediatrics', 'Emily Davis'),
  ('Surgical Ward', 2, 18, 12, 6, 'Surgery', 'Robert Martinez')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT * FROM wards;
