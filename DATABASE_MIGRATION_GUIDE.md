# Database Migration Guide - Add form_id Column

## Issue
OT forms were not displaying correctly when clicked in the form history because the system couldn't retrieve the form template.

## Solution
Add a `form_id` column to both `patient_forms` and `ot_forms` tables to store the form template ID.

## Migration Steps

### Step 1: Run the Migration Script
Execute the following SQL script in your Supabase SQL Editor:

```sql
-- File: sql/06-add-form-id-column.sql

-- Add form_id to patient_forms
ALTER TABLE patient_forms ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Add form_id to ot_forms
ALTER TABLE ot_forms ADD COLUMN IF NOT EXISTS form_id TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_id ON patient_forms(form_id);
CREATE INDEX IF NOT EXISTS idx_ot_forms_form_id ON ot_forms(form_id);
```

### Step 2: Verify the Migration
Run this query to verify the columns were added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('patient_forms', 'ot_forms')
ORDER BY table_name, ordinal_position;
```

You should see `form_id` listed for both tables.

### Step 3: Test the Application
1. Start your application: `npm run dev`
2. Navigate to Patients page
3. Click "Forms" for any patient
4. Fill out and save a new OT form
5. Go to "Form History" tab
6. Click on the saved OT form
7. The form should now display correctly with all drawings

## What Changed

### Database Schema
**Before:**
- `form_type` stored the category (e.g., "OT", "Monitoring")
- No way to identify the specific form template

**After:**
- `form_type` still stores the category for routing to correct table
- `form_id` stores the specific form template ID (e.g., "informed-consent-surgery")

### Application Code
**DrawableFormViewer.jsx:**
- Now saves both `formType` (category) and `formId` (template ID)

**SavedFormViewer.jsx:**
- Uses `formId` to retrieve the correct form template
- Falls back to `formType` for backward compatibility with old records

## Backward Compatibility

Old forms (saved before this migration) will still work because:
- The code falls back to using `formType` if `formId` is not available
- For monitoring forms, `formType` was the form ID, so they'll continue to work
- Only new forms will have the `form_id` field populated

## Notes

- This migration is **non-destructive** - it only adds new columns
- Existing data is not modified
- The `IF NOT EXISTS` clause prevents errors if run multiple times
- Indexes are created for better query performance
