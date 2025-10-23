# OT Forms Quick Start Guide

## Setup Steps

### 1. Create Database Table
Execute the SQL script in your Supabase SQL Editor:

```sql
-- Navigate to Supabase Dashboard > SQL Editor
-- Copy and paste the contents of: sql/05-create-ot-forms-table.sql
-- Click "Run" to create the ot_forms table
```

### 2. Verify Installation
The following files have been created/modified:

**New Files:**
- ✅ `sql/05-create-ot-forms-table.sql`
- ✅ `src/data/otForms.js`
- ✅ `OT_FORMS_FEATURE.md`
- ✅ `OT_FORMS_QUICK_START.md`

**Modified Files:**
- ✅ `src/data/monitoringForms.js`
- ✅ `src/context/AppContext.jsx`
- ✅ `src/pages/Patients.jsx`
- ✅ `src/components/DrawableFormViewer.jsx`

### 3. Test the Feature

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Navigate to Patients page**

3. **Select a patient and click "Forms" button**

4. **Filter by "OT" category**
   - You should see 12 OT forms available

5. **Try filling out a form:**
   - Click on "Surgical Safety Checklist"
   - Draw some annotations
   - Fill in your name and role
   - Add notes
   - Click "Save Form"

6. **View form history:**
   - Click "Form History" tab
   - Your saved OT form should appear in the list
   - Click to view the saved form

## Available OT Forms

| Form Name | Pages | Required Roles |
|-----------|-------|----------------|
| Informed Consent for Surgery & Procedures | 2 | Doctor, Surgeon |
| Consent for Anesthesia & Sedation | 1 | Anesthesiologist, Doctor |
| Consent for Surgical Procedures | 1 | Doctor, Surgeon |
| General Information Consent | 1 | Doctor, Nurse |
| High Risk Consent | 2 | Doctor, Surgeon |
| Input Output Chart | 1 | Nurse, Anesthesiologist |
| Operation Report | 1 | Surgeon, Doctor |
| OT Nurse Monitoring | 1 | Nurse |
| Pre-Anaesthetic Assessment | 4 | Anesthesiologist |
| Pre-Operative Check for Nurses | 2 | Nurse |
| Surgical Summary | 2 | Surgeon, Doctor |
| Surgical Safety Checklist | 1 | Nurse, Surgeon, Anesthesiologist |

## Key Features

✨ **Separate Database Table**
- OT forms are stored in `ot_forms` table
- Patient monitoring forms remain in `patient_forms` table
- Both accessible from the same interface

✨ **Drawing & Annotation**
- Draw directly on form images
- Multiple colors and pen widths
- Eraser tool
- Undo/Redo functionality
- Zoom in/out

✨ **Multi-page Support**
- Navigate between pages
- Drawings saved per page
- Download individual pages

✨ **Form History**
- View all submitted forms
- Filter by patient
- See who filled the form and when
- View completed forms with annotations

## Troubleshooting

**Issue: OT forms not showing**
- Verify `sql/05-create-ot-forms-table.sql` was executed in Supabase
- Check browser console for errors
- Ensure `src/data/otForms.js` exists

**Issue: Forms not saving**
- Check Supabase connection in `src/lib/supabase.js`
- Verify RLS policies are enabled
- Check browser console for API errors

**Issue: Images not loading**
- Verify all images exist in `/public/ot/` directory
- Check image file names match those in `otForms.js`
- Ensure image paths start with `/ot/`

## Next Steps

1. ✅ Execute SQL script to create table
2. ✅ Test form filling functionality
3. ✅ Test form history viewing
4. 🔄 Customize role-based access (optional)
5. 🔄 Add more forms as needed (optional)

## Support

For detailed documentation, see `OT_FORMS_FEATURE.md`
