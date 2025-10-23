# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Database (5 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `ihgxnminfknrirszrvsq`

2. **Run Database Schema**
   - Click on **SQL Editor** in the left sidebar
   - Open the file `supabase-schema.sql` from this project
   - Copy all the SQL code
   - Paste it into the SQL Editor
   - Click **RUN** button

3. **Verify Tables Created**
   - Go to **Table Editor** in the left sidebar
   - You should see 3 tables: `wards`, `patients`, `staff`
   - The `wards` table should have 4 sample wards already inserted

### Step 2: Install Dependencies (if not done)

```bash
npm install
```

### Step 3: Start the Application

```bash
npm run dev
```

The application will open at: **http://localhost:3000**

## ✅ What's Already Configured

- ✅ Supabase credentials (in `.env` file)
- ✅ Database connection
- ✅ All React components
- ✅ Routing and navigation
- ✅ Responsive design

## 📊 Using the Application

### Dashboard
- View overall statistics
- See ward occupancy charts
- Monitor patient status distribution
- Check recent admissions

### Wards Page
- Click **"Add Ward"** to create a new ward
- Edit existing wards by clicking the edit icon
- Delete wards (if no patients assigned)
- View bed occupancy in real-time

### Patients Page
- Click **"Add Patient"** to register a new patient
- Search and filter patients
- Update patient status
- Discharge patients when ready
- View complete patient records

### Staff Page
- Click **"Add Staff"** to add doctors or nurses
- Filter by role or department
- Update staff information
- Manage shifts and status

## 🔧 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env` file exists in the project root
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Tables not found
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that you're in the correct project

### Data not loading
- Open browser console (F12) to check for errors
- Verify your internet connection
- Check Supabase project status

## 🎯 Next Steps

1. **Add Your First Ward**
   - Go to Wards page
   - Click "Add Ward"
   - Fill in the details
   - Click "Add Ward" to save

2. **Register Patients**
   - Go to Patients page
   - Click "Add Patient"
   - Select a ward from the dropdown
   - Fill in patient details
   - Click "Add Patient" to save

3. **Add Staff Members**
   - Go to Staff page
   - Click "Add Staff"
   - Choose role (Doctor/Nurse)
   - Fill in details
   - Click "Add Staff" to save

## 📝 Important Notes

- All data is automatically saved to Supabase
- Changes are synced in real-time
- Data persists across sessions
- The `.env` file is gitignored for security

## 🆘 Need Help?

Check these files for more information:
- `SUPABASE_SETUP.md` - Detailed database setup
- `README.md` - Full project documentation
- `supabase-schema.sql` - Database structure

Enjoy managing your hospital wards! 🏥
