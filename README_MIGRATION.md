# 🏥 Ward Management System - Supabase Migration Package

## 📦 What's Included

This migration package contains everything you need to move your Ward Management System to a new Supabase project.

---

## 📁 Migration Files

### 1. **NEW_SUPABASE_MIGRATION.sql** ⭐ MAIN FILE
   - **Purpose**: Complete database schema for your new Supabase project
   - **Contains**: All 6 tables, indexes, RLS policies, triggers, and sample data
   - **Action**: Run this in your new Supabase project's SQL Editor

### 2. **MIGRATION_TO_NEW_SUPABASE.md** 📖 DETAILED GUIDE
   - **Purpose**: Step-by-step migration instructions
   - **Contains**: Complete walkthrough with troubleshooting
   - **Action**: Follow this for detailed migration process

### 3. **QUICK_START_NEW_PROJECT.md** ⚡ QUICK REFERENCE
   - **Purpose**: Fast 10-minute setup guide
   - **Contains**: Condensed steps for quick migration
   - **Action**: Use this if you want to migrate quickly

### 4. **EXPORT_OLD_DATA.sql** 💾 DATA BACKUP
   - **Purpose**: Export existing data from old project
   - **Contains**: SQL queries to export all your data
   - **Action**: Run in OLD project if you want to keep existing data

### 5. **.env.example** 🔧 CONFIGURATION TEMPLATE
   - **Purpose**: Template for environment variables
   - **Contains**: Format for Supabase credentials
   - **Action**: Use as reference when updating your `.env` file

---

## 🚀 Quick Migration Steps

### For First-Time Users (No existing data):

1. **Create new Supabase project** at https://supabase.com/dashboard
2. **Run** `NEW_SUPABASE_MIGRATION.sql` in SQL Editor
3. **Update** `.env` file with new credentials
4. **Restart** development server: `npm run dev`
5. **Done!** Start using the application

### For Users with Existing Data:

1. **Export data** using `EXPORT_OLD_DATA.sql` from old project
2. **Create new Supabase project**
3. **Run** `NEW_SUPABASE_MIGRATION.sql` in new project
4. **Import data** via Table Editor (CSV import)
5. **Update** `.env` file with new credentials
6. **Restart** development server
7. **Verify** data migrated correctly

---

## 🗄️ Database Schema

Your new Supabase project will have these tables:

### Core Tables:
- **wards** (4 sample records)
  - Ward information, bed counts, departments
  
- **ward_patients** (empty)
  - Patient records with admission/discharge tracking
  
- **staff** (empty)
  - Staff member information
  
- **doctors** (4 sample records)
  - Doctor information and specializations

### Form Tables:
- **patient_forms** (empty)
  - Patient monitoring forms with JSONB data storage
  
- **ot_forms** (empty)
  - Operation theatre forms with JSONB data storage

---

## 🔑 Environment Variables Required

Update your `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Get these from:**
Supabase Dashboard → Settings → API

---

## ✅ Migration Checklist

Use this checklist to track your progress:

- [ ] Read migration documentation
- [ ] Create new Supabase project
- [ ] Copy Project URL and anon key
- [ ] (Optional) Export old data using `EXPORT_OLD_DATA.sql`
- [ ] Run `NEW_SUPABASE_MIGRATION.sql` in new project
- [ ] Verify all 6 tables created in Table Editor
- [ ] Update `.env` file with new credentials
- [ ] (Optional) Import old data via CSV
- [ ] Restart development server
- [ ] Verify connection in browser console
- [ ] Test adding/viewing data
- [ ] Migration complete! 🎉

---

## 📊 What Gets Migrated

### Automatically Created:
✅ Database tables with proper schema  
✅ Indexes for performance  
✅ Row Level Security (RLS) enabled  
✅ RLS policies for data access  
✅ Automatic timestamp triggers  
✅ Sample wards (4 records)  
✅ Sample doctors (4 records)  

### Requires Manual Migration:
⚠️ Existing patient data  
⚠️ Existing staff data  
⚠️ Existing form data  
⚠️ Custom wards (beyond samples)  

---

## 🛠️ Technical Details

### Tables Structure:

1. **wards**
   - Primary Key: UUID
   - Tracks: beds, occupancy, department
   - Foreign Keys: None

2. **ward_patients**
   - Primary Key: UUID
   - Foreign Key: `ward_id` → wards(id)
   - Tracks: patient info, admission/discharge

3. **staff**
   - Primary Key: UUID
   - Unique: email
   - Tracks: staff details, shifts

4. **doctors**
   - Primary Key: UUID
   - Unique: email
   - Tracks: doctor info, specialization

5. **patient_forms**
   - Primary Key: UUID
   - Foreign Key: `patient_id` → ward_patients(id)
   - JSONB: form_data

6. **ot_forms**
   - Primary Key: UUID
   - Foreign Key: `patient_id` → ward_patients(id)
   - JSONB: form_data

### Security:
- RLS enabled on all tables
- Policies allow all operations (customize for production)
- Unique constraints on email fields

### Performance:
- Indexes on foreign keys
- Indexes on frequently queried fields
- Automatic timestamp updates via triggers

---

## 🆘 Common Issues & Solutions

### "Missing Supabase environment variables"
**Cause**: `.env` file not updated or server not restarted  
**Solution**: Update `.env` and restart with `npm run dev`

### "relation does not exist"
**Cause**: Migration script not run or run in wrong project  
**Solution**: Verify project and re-run `NEW_SUPABASE_MIGRATION.sql`

### Data not loading
**Cause**: RLS policies or connection issues  
**Solution**: Check browser console, verify credentials

### Can't import data
**Cause**: Foreign key constraints  
**Solution**: Import in order: wards → doctors → ward_patients → staff → forms

---

## 📞 Support Resources

### Documentation:
- **Detailed Guide**: `MIGRATION_TO_NEW_SUPABASE.md`
- **Quick Start**: `QUICK_START_NEW_PROJECT.md`
- **Supabase Docs**: https://supabase.com/docs

### Debugging:
- **Browser Console**: F12 → Console tab
- **Supabase Logs**: Dashboard → Logs → API Logs
- **Table Verification**: Dashboard → Table Editor

### Testing Connection:
```sql
-- Run in SQL Editor to test
SELECT * FROM wards;
SELECT * FROM doctors;
```

---

## 🔒 Security Best Practices

### Development:
- Current RLS policies allow all operations
- Suitable for development and testing

### Production:
Consider implementing:
- User authentication
- Role-based access control
- Restricted RLS policies
- API rate limiting
- Audit logging

Example production policy:
```sql
-- Restrict deletions to admin users
CREATE POLICY "Admin only delete" 
ON wards FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📈 Next Steps After Migration

1. **Verify Everything Works**
   - Test all CRUD operations
   - Check data relationships
   - Verify forms functionality

2. **Add Your Data**
   - Import existing data if needed
   - Add new wards, patients, staff
   - Test the complete workflow

3. **Customize**
   - Update RLS policies for production
   - Configure authentication
   - Set up backups

4. **Deploy**
   - Set up production environment
   - Configure domain
   - Enable monitoring

---

## 📝 Important Notes

- **Backup First**: Always export old data before migrating
- **Test Thoroughly**: Verify all features work after migration
- **Keep Credentials Safe**: Never commit `.env` to version control
- **Monitor Usage**: Check Supabase dashboard for usage metrics
- **Plan for Scale**: Consider upgrading Supabase plan if needed

---

## 🎯 Migration Timeline

| Step | Estimated Time |
|------|----------------|
| Create new project | 2 minutes |
| Get credentials | 1 minute |
| Run migration script | 2 minutes |
| Update .env | 1 minute |
| Restart server | 1 minute |
| Verify & test | 3 minutes |
| **Total** | **~10 minutes** |

*Add 15-30 minutes if migrating existing data*

---

## ✨ Features Enabled

After migration, your system will have:

- ✅ Full ward management
- ✅ Patient admission/discharge tracking
- ✅ Staff management
- ✅ Doctor directory
- ✅ Patient monitoring forms
- ✅ OT forms
- ✅ Real-time updates
- ✅ Data persistence
- ✅ Secure access with RLS

---

## 🎉 Success Criteria

Migration is successful when:

- [x] All 6 tables visible in Table Editor
- [x] Sample data (wards, doctors) present
- [x] Application connects without errors
- [x] Can add/view/edit/delete records
- [x] Forms functionality works
- [x] No console errors

---

**Current Project**: ihgxnminfknrirszrvsq (OLD)  
**New Project**: _______________ (TO BE FILLED)  
**Migration Date**: _______________  

---

**Ready to migrate?** Start with `QUICK_START_NEW_PROJECT.md` for a fast setup, or `MIGRATION_TO_NEW_SUPABASE.md` for detailed instructions.

**Good luck! 🚀**
