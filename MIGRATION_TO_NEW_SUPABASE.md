# 🚀 Migration Guide: Moving to a New Supabase Project

This guide will help you migrate your Ward Management System to a new Supabase project.

## 📋 Prerequisites

- Access to Supabase Dashboard
- Basic understanding of SQL
- Text editor access to modify `.env` file

---

## 🔧 Step-by-Step Migration Process

### **Step 1: Create a New Supabase Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: Ward Management System (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (usually takes 1-2 minutes)

---

### **Step 2: Get Your New Project Credentials**

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. You'll need two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. **Keep these values handy** - you'll need them in Step 4

---

### **Step 3: Run the Database Migration Script**

1. In your Supabase project, click on **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Open the file `NEW_SUPABASE_MIGRATION.sql` from your project folder
4. **Copy the entire contents** of the SQL file
5. **Paste it** into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
7. Wait for the script to complete (should take a few seconds)

#### ✅ What This Script Does:

- Creates all 6 required tables:
  - `wards` - Ward information
  - `ward_patients` - Patient records
  - `staff` - Staff members
  - `doctors` - Doctor information
  - `patient_forms` - Patient monitoring forms
  - `ot_forms` - Operation theatre forms
- Sets up all indexes for optimal performance
- Enables Row Level Security (RLS)
- Creates RLS policies for data access
- Sets up automatic timestamp triggers
- Inserts sample data for wards and doctors

#### 🔍 Verify the Migration:

After running the script, you should see a verification table showing:
```
table_name      | row_count
----------------|----------
wards           | 4
ward_patients   | 0
staff           | 0
doctors         | 4
patient_forms   | 0
ot_forms        | 0
```

You can also verify by:
1. Going to **Table Editor** in the sidebar
2. You should see all 6 tables listed

---

### **Step 4: Update Environment Variables**

1. Open your project folder
2. Locate the `.env` file in the root directory
3. Update it with your new Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
```

**Replace:**
- `YOUR_NEW_PROJECT_ID` with your actual project URL from Step 2
- `YOUR_NEW_ANON_KEY` with your actual anon key from Step 2

#### 📝 Example:

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NzIwMCwiZXhwIjoxOTU1MTYzMjAwfQ.example_key_here
```

---

### **Step 5: Restart Your Development Server**

1. **Stop** your current development server (if running)
   - Press `Ctrl+C` in the terminal
2. **Start** the server again:
   ```bash
   npm run dev
   ```
3. The application will now connect to your new Supabase project

---

### **Step 6: Verify the Connection**

1. Open your application in the browser
2. Check the browser console (F12 → Console tab)
3. You should see:
   ```
   Supabase URL: https://YOUR_NEW_PROJECT_ID.supabase.co
   Supabase Key exists: true
   ```
4. Try adding a ward or patient to verify everything works

---

## 🔄 Data Migration (Optional)

If you need to migrate existing data from your old Supabase project:

### Option 1: Manual Export/Import

1. **Export from old project:**
   - Go to old Supabase project → Table Editor
   - For each table, click the table → Export → CSV
   
2. **Import to new project:**
   - Go to new Supabase project → Table Editor
   - For each table, click the table → Import → Upload CSV

### Option 2: Using SQL Dump

1. **Export from old project:**
   ```sql
   -- Run this in old project's SQL Editor for each table
   COPY wards TO STDOUT WITH CSV HEADER;
   COPY ward_patients TO STDOUT WITH CSV HEADER;
   COPY staff TO STDOUT WITH CSV HEADER;
   COPY doctors TO STDOUT WITH CSV HEADER;
   COPY patient_forms TO STDOUT WITH CSV HEADER;
   COPY ot_forms TO STDOUT WITH CSV HEADER;
   ```

2. **Import to new project:**
   - Use the CSV import feature in Table Editor

---

## 🛡️ Security Considerations

### Current Setup:
- RLS is enabled on all tables
- Policies allow all operations (suitable for development)

### For Production:
You should update RLS policies to restrict access based on user roles:

```sql
-- Example: Restrict ward deletion to admin users only
DROP POLICY "Enable all operations for wards" ON wards;

CREATE POLICY "Allow read for all users" 
ON wards FOR SELECT USING (true);

CREATE POLICY "Allow insert/update/delete for admin only" 
ON wards FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📊 Database Schema Overview

### Tables Created:

1. **wards** - Ward management
   - Tracks ward details, bed counts, departments
   
2. **ward_patients** - Patient records
   - Patient information, admission/discharge dates
   - Links to wards via `ward_id`
   
3. **staff** - Staff members
   - Nurse and staff information
   
4. **doctors** - Doctor information
   - Doctor details and specializations
   
5. **patient_forms** - Monitoring forms
   - Tracks patient monitoring forms
   - Links to patients via `patient_id`
   
6. **ot_forms** - Operation theatre forms
   - Tracks OT forms
   - Links to patients via `patient_id`

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
- Verify `.env` file exists in project root
- Check that variables start with `VITE_`
- Restart the dev server after changing `.env`

### Issue: "relation does not exist" errors

**Solution:**
- Verify you ran the migration script in the correct project
- Check Table Editor to confirm tables exist
- Re-run the migration script if needed

### Issue: Data not loading

**Solution:**
- Check browser console for errors
- Verify RLS policies are created (run verification query)
- Check Supabase logs: Dashboard → Logs

### Issue: Authentication errors

**Solution:**
- Verify the anon key is correct
- Make sure you copied the entire key (they're very long)
- Check there are no extra spaces in `.env` file

---

## 📞 Need Help?

If you encounter issues:

1. **Check Supabase Logs:**
   - Dashboard → Logs → API Logs
   
2. **Check Browser Console:**
   - F12 → Console tab
   
3. **Verify Tables:**
   - Dashboard → Table Editor
   
4. **Test Connection:**
   ```sql
   -- Run in SQL Editor
   SELECT * FROM wards;
   ```

---

## ✅ Migration Checklist

- [ ] Created new Supabase project
- [ ] Copied Project URL and anon key
- [ ] Ran `NEW_SUPABASE_MIGRATION.sql` in SQL Editor
- [ ] Verified all 6 tables were created
- [ ] Updated `.env` file with new credentials
- [ ] Restarted development server
- [ ] Verified connection in browser console
- [ ] Tested adding/viewing data in the application
- [ ] (Optional) Migrated existing data from old project

---

## 🎉 Success!

Your Ward Management System is now running on a new Supabase project!

**Next Steps:**
- Start using the application
- Add your wards, patients, and staff
- Customize RLS policies for production use
- Set up authentication if needed

---

## 📝 Important Notes

- **Keep your `.env` file secure** - Never commit it to version control
- **Save your database password** - You'll need it for direct database access
- **Backup regularly** - Use Supabase's backup features
- **Monitor usage** - Check your Supabase dashboard for usage metrics

---

**Migration Date:** _______________  
**Old Project ID:** ihgxnminfknrirszrvsq  
**New Project ID:** _______________  
**Migrated By:** _______________
