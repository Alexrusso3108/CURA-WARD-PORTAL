# OT Forms Feature

## Overview
The OT (Operation Theatre) Forms feature allows healthcare staff to fill out and manage surgical and pre-operative forms for patients. This feature is integrated with the existing patient forms system but uses a separate database table for OT-specific forms.

## Database Setup

### Table: `ot_forms`
Run the SQL script to create the OT forms table:
```bash
# Execute in Supabase SQL Editor
sql/05-create-ot-forms-table.sql
```

The table structure includes:
- `id`: Unique identifier
- `patient_id`: Reference to ward_patients table
- `form_type`: Category of the form (e.g., "OT")
- `form_name`: Name of the specific form
- `filled_by`: Name of the staff member who filled the form
- `filled_by_role`: Role of the staff member
- `form_data`: JSONB field storing form annotations/drawings
- `notes`: Additional notes
- `status`: Form status (Draft/Completed)
- `created_at`, `updated_at`: Timestamps

## Available OT Forms

The system includes 12 OT forms:

1. **Informed Consent for Surgery & Procedures** (2 pages)
   - Patient consent for surgical procedures
   - Required roles: Doctor, Surgeon

2. **Consent for Anesthesia & Sedation** (1 page)
   - Patient consent for anesthesia
   - Required roles: Anesthesiologist, Doctor

3. **Consent for Surgical Procedures** (1 page)
   - General surgical procedures consent
   - Required roles: Doctor, Surgeon

4. **General Information Consent** (1 page)
   - General patient information and consent
   - Required roles: Doctor, Nurse

5. **High Risk Consent** (2 pages)
   - Consent for high-risk procedures
   - Required roles: Doctor, Surgeon

6. **Input Output Chart** (1 page)
   - Track fluid input/output during surgery
   - Required roles: Nurse, Anesthesiologist

7. **Operation Report** (1 page)
   - Detailed surgical operation report
   - Required roles: Surgeon, Doctor

8. **OT Nurse Monitoring** (1 page)
   - Nursing monitoring during operation
   - Required roles: Nurse

9. **Pre-Anaesthetic Assessment** (4 pages)
   - Pre-operative anesthesia assessment
   - Required roles: Anesthesiologist

10. **Pre-Operative Check for Nurses** (2 pages)
    - Pre-operative nursing checklist
    - Required roles: Nurse

11. **Surgical Summary** (2 pages)
    - Summary of surgical procedure
    - Required roles: Surgeon, Doctor

12. **Surgical Safety Checklist** (1 page)
    - WHO surgical safety checklist
    - Required roles: Nurse, Surgeon, Anesthesiologist

## How to Use

### Accessing OT Forms
1. Navigate to the **Patients** page
2. Click the **Forms** button for any patient
3. In the forms modal, select the **OT** category filter
4. All OT forms will be displayed

### Filling Out a Form
1. Click on any OT form card to open it
2. Use the drawing tools to annotate the form:
   - **Pen**: Draw on the form
   - **Eraser**: Erase drawings
   - **Colors**: Change pen color
   - **Width**: Adjust pen thickness
   - **Zoom**: Zoom in/out for better visibility
3. Navigate between pages using arrow buttons (for multi-page forms)
4. Fill in required information:
   - Your name
   - Your role
   - Additional notes (optional)
5. Click **Save Form** to submit

### Viewing Form History
1. In the forms modal, click the **Form History** tab
2. View all submitted forms (both patient monitoring and OT forms)
3. Click on any form to view the filled version
4. Forms are marked with their status (Draft/Completed)

## Technical Implementation

### Files Modified/Created

**New Files:**
- `sql/05-create-ot-forms-table.sql` - Database table creation
- `src/data/otForms.js` - OT forms configuration

**Modified Files:**
- `src/data/monitoringForms.js` - Added OT category and imported OT forms
- `src/context/AppContext.jsx` - Added OT forms state and operations
- `src/pages/Patients.jsx` - Added OT forms fetching and saving
- `src/components/DrawableFormViewer.jsx` - Updated to use form category for routing

### Data Flow
1. User selects an OT form from the modal
2. `DrawableFormViewer` component opens with the form
3. User fills out the form with annotations
4. On save, form data includes `formType: "OT"`
5. `handleSaveForm` in Patients.jsx checks the formType
6. If formType is "OT", data is saved to `ot_forms` table
7. Otherwise, data is saved to `patient_forms` table

### API Operations

**Fetch OT Forms:**
```javascript
const { otForms, fetchOtForms } = useApp();
await fetchOtForms();
```

**Add OT Form:**
```javascript
const { addOtForm } = useApp();
const result = await addOtForm({
  patientId: patient.id,
  formType: 'OT',
  formName: 'Operation Report',
  filledBy: 'Dr. Smith',
  filledByRole: 'Surgeon',
  notes: 'Procedure completed successfully',
  formData: { /* drawing data */ },
  status: 'Completed'
});
```

## Form Categories
The system now supports the following form categories:
- All
- Monitoring
- Medication
- Assessment
- Procedures
- Consent
- Documentation
- Billing
- **OT** (New)

## Security
- Row Level Security (RLS) is enabled on the `ot_forms` table
- All operations are allowed through the policy (can be customized)
- Form data is stored securely in JSONB format

## Future Enhancements
- Role-based form access control
- Form templates with pre-filled fields
- Digital signatures
- Form approval workflow
- Export forms to PDF
- Form versioning
