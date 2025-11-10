# ⚡ Quick Start: New Supabase Project Setup

This is a condensed guide to get your Ward Management System running on a new Supabase project in **under 10 minutes**.

---

## 🎯 Quick Steps

### 1️⃣ Create Supabase Project (2 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Enter project name and password
4. Click **"Create new project"**
5. Wait for provisioning

### 2️⃣ Get Credentials (1 minute)

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### 3️⃣ Run Database Setup (2 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `NEW_SUPABASE_MIGRATION.sql` from your project
4. Copy entire file contents
5. Paste into SQL Editor
6. Click **"Run"**
7. Wait for completion

### 4️⃣ Update .env File (1 minute)

Open `.env` file in your project root and update:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Replace with your actual values from Step 2!**

### 5️⃣ Start Application (1 minute)

```bash
# Stop current server (Ctrl+C if running)
# Then start fresh:
npm run dev
```

### 6️⃣ Verify (1 minute)

1. Open browser to `http://localhost:5173`
2. Press F12 → Console tab
3. Should see:
   ```
   Supabase URL: https://your-project.supabase.co
   Supabase Key exists: true
   ```
4. Try adding a ward to test!

---

## ✅ Done!

Your application is now connected to the new Supabase project.

---

## 🔧 Files You Need

- **`NEW_SUPABASE_MIGRATION.sql`** - Complete database schema
- **`.env`** - Your environment variables (update this!)
- **`MIGRATION_TO_NEW_SUPABASE.md`** - Detailed migration guide

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing Supabase environment variables" | Restart dev server after updating `.env` |
| "relation does not exist" | Re-run the SQL migration script |
| Data not loading | Check browser console for errors |
| Can't connect | Verify URL and key in `.env` are correct |

---

## 📋 What Gets Created

The migration script creates:

- ✅ **6 Tables**: wards, ward_patients, staff, doctors, patient_forms, ot_forms
- ✅ **Indexes**: For fast queries
- ✅ **RLS Policies**: Security enabled
- ✅ **Triggers**: Auto-update timestamps
- ✅ **Sample Data**: 4 wards, 4 doctors

---

## 🎉 Next Steps

- Start adding your data through the UI
- Customize the application as needed
- Set up proper authentication if required
- Configure production RLS policies

---

**Need more details?** See `MIGRATION_TO_NEW_SUPABASE.md` for the complete guide.
