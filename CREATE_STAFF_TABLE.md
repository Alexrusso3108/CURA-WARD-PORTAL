# Create Staff Table

## 📋 Run This SQL in Supabase

1. Go to: https://supabase.com/dashboard/project/ihgxnminfknrirsrzvsq
2. Click **SQL Editor** → **New Query**
3. Copy and paste this SQL:

```sql
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
```

4. Click **RUN** (or press Ctrl+Enter)
5. You should see 8 sample staff members (4 doctors + 4 nurses)

## ✅ After Running the SQL

1. **Refresh your app** at http://localhost:3000
2. Go to **Staff** page
3. You'll see:
   - **Doctors section** with 4 doctors
   - **Nurses section** with 4 nurses
   - Search and filter functionality
   - Role and department filters

4. Click **"Add Staff"** to add new staff members

## 📝 Staff Table Structure

### Fields:
- **Name**: Full name of staff member
- **Role**: Doctor, Nurse, or other roles
- **Department**: General Medicine, Critical Care, Pediatrics, Surgery, etc.
- **Specialization**: Area of expertise
- **Phone**: Contact number
- **Email**: Email address (must be unique)
- **Shift**: Morning, Evening, or Night
- **Status**: Active, On Leave, or Inactive

### Features:
- ✅ Unique email constraint
- ✅ Indexed by role, department, and status
- ✅ Automatic timestamp updates
- ✅ Row Level Security enabled
- ✅ Sample data included

## 🎯 What You Can Do After This

- ✅ View all staff members grouped by role
- ✅ Search staff by name or specialization
- ✅ Filter by role (Doctor, Nurse, etc.)
- ✅ Filter by department
- ✅ Add new staff members
- ✅ Edit staff information
- ✅ Update staff status (Active/On Leave/Inactive)
- ✅ Delete staff records
- ✅ View contact information (email, phone)
- ✅ Track shift assignments

## 📊 Sample Data Included

### Doctors (4):
1. Dr. Sarah Johnson - General Medicine (Morning)
2. Dr. Michael Chen - Critical Care (Evening)
3. Dr. Emily Davis - Pediatrics (Morning)
4. Dr. Robert Martinez - Surgery (Night)

### Nurses (4):
1. Nurse Jennifer Lee - General Medicine (Morning)
2. Nurse David Brown - Critical Care (Evening)
3. Nurse Lisa Anderson - Pediatrics (Night)
4. Nurse James Wilson - Surgery (Morning)

## 🔗 Integration with Other Features

The staff table works seamlessly with:
- **Wards**: Nurses can be assigned to wards
- **Patients**: Doctors appear in patient records
- **Dashboard**: Staff counts and statistics

Ready to manage your hospital staff! 👨‍⚕️👩‍⚕️
