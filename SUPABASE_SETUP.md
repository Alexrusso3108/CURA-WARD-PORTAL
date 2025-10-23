# Supabase Setup Guide

## Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ihgxnminfknrirszrvsq`
3. Navigate to the **SQL Editor** in the left sidebar
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor
6. Click **Run** to execute the SQL and create all tables

## Step 2: Verify Tables Created

After running the SQL, verify that the following tables were created:
- `wards`
- `patients`
- `staff`

You can check this in the **Table Editor** section.

## Step 3: Environment Variables

The `.env` file has already been created with your Supabase credentials:
- **Supabase URL**: https://ihgxnminfknrirszrvsq.supabase.co
- **Anon Key**: (already configured)

⚠️ **Security Note**: The `.env` file is gitignored to protect your API keys.

## Step 4: Install Dependencies and Run

```bash
# Install the Supabase client
npm install

# Start the development server
npm run dev
```

## Database Schema Overview

### Wards Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `floor` (Integer)
- `total_beds` (Integer)
- `occupied_beds` (Integer)
- `available_beds` (Integer)
- `department` (Text)
- `nurse_in_charge` (Text)
- `created_at`, `updated_at` (Timestamps)

### Patients Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `age` (Integer)
- `gender` (Text)
- `ward_id` (UUID, Foreign Key → wards)
- `bed_number` (Text)
- `admission_date` (Timestamp)
- `discharge_date` (Timestamp, nullable)
- `diagnosis` (Text)
- `status` (Text)
- `doctor` (Text)
- `emergency_contact` (Text)
- `blood_group` (Text)
- `created_at`, `updated_at` (Timestamps)

### Staff Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `role` (Text)
- `department` (Text)
- `specialization` (Text)
- `phone` (Text)
- `email` (Text, Unique)
- `shift` (Text)
- `status` (Text)
- `created_at`, `updated_at` (Timestamps)

## Features Enabled

✅ Row Level Security (RLS) enabled on all tables
✅ Automatic timestamp updates
✅ Sample ward data inserted
✅ Indexes for optimized queries
✅ Foreign key relationships

## Troubleshooting

### If you get "relation does not exist" errors:
- Make sure you ran the SQL schema in the correct project
- Check the Table Editor to verify tables exist

### If you get authentication errors:
- Verify your `.env` file has the correct credentials
- Make sure the environment variables start with `VITE_`
- Restart the dev server after changing `.env`

### If data doesn't load:
- Check browser console for errors
- Verify RLS policies are created (they should allow all operations)
- Check Supabase logs in the Dashboard

## Next Steps

After setup, you can:
1. Add wards through the UI
2. Add patients and assign them to wards
3. Manage staff members
4. View analytics on the dashboard

All data is now persisted in Supabase and will be available across sessions and devices!
