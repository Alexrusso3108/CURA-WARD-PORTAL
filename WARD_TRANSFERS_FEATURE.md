# Ward Transfers Feature Documentation

## Overview
The Ward Transfers feature allows hospital staff to manage patient transfers between different wards. It provides a complete workflow from creating transfer requests to completing the actual transfer, with proper tracking and audit trails.

## Features Implemented

### 1. Database Schema
- **Table Name**: `ward_transfers`
- **Location**: `sql/CREATE_WARD_TRANSFERS_TABLE.sql`

#### Table Structure
```sql
- id (UUID, Primary Key)
- patient_id (UUID, Foreign Key → ward_patients)
- from_ward_id (UUID, Foreign Key → hospital_wards)
- to_ward_id (UUID, Foreign Key → hospital_wards)
- from_bed_number (TEXT)
- to_bed_number (TEXT)
- transfer_date (TIMESTAMP)
- transfer_reason (TEXT)
- transferred_by (TEXT)
- transferred_by_role (TEXT)
- approved_by (TEXT)
- approval_date (TIMESTAMP)
- status (TEXT: Pending, Approved, Completed, Cancelled)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Indexes
- `idx_ward_transfers_patient_id` - Fast patient lookup
- `idx_ward_transfers_from_ward` - Source ward queries
- `idx_ward_transfers_to_ward` - Destination ward queries
- `idx_ward_transfers_status` - Status filtering
- `idx_ward_transfers_transfer_date` - Date-based sorting

### 2. Backend Functions (AppContext)

#### State Management
- `wardTransfers` - Array of all transfer records

#### Functions
- **`fetchWardTransfers()`** - Retrieves all transfer records
- **`createWardTransfer(transferData)`** - Creates a new transfer request
- **`completeWardTransfer(transferId, patientId, toWardId, toBedNumber)`** - Completes a transfer and updates patient location
- **`updateWardTransferStatus(transferId, status, approvedBy)`** - Updates transfer status
- **`deleteWardTransfer(transferId)`** - Deletes a transfer record

### 3. User Interface

#### Ward Transfers Page (`/transfers`)
**Location**: `src/pages/WardTransfers.jsx`

**Features**:
- View all ward transfers in a table format
- Search by patient name or transfer reason
- Filter by status (All, Pending, Approved, Completed, Cancelled)
- Create new transfer requests
- View detailed transfer information
- Approve/Cancel pending transfers
- Complete approved transfers
- Delete completed/cancelled transfers

**Status Workflow**:
1. **Pending** → Initial state when transfer is created
2. **Approved** → Admin/authorized staff approves the transfer
3. **Completed** → Transfer is executed, patient moved to new ward
4. **Cancelled** → Transfer request is cancelled

#### Patient Transfer Button
**Location**: `src/pages/Patients.jsx`

**Features**:
- Transfer button (purple icon) in patient actions
- Quick transfer modal from patient list
- Auto-populates current ward and bed information
- Shows available beds in destination wards

### 4. Navigation
- Added "Ward Transfers" menu item in sidebar
- Icon: ArrowRightLeft (from lucide-react)
- Route: `/transfers`

## Usage Workflow

### Creating a Transfer Request

1. **From Patients Page**:
   - Click the transfer icon (⇄) next to a patient
   - Fill in the transfer form:
     - Select destination ward
     - Enter new bed number
     - Provide transfer reason
     - Add your name and role
     - Optional: Add notes
   - Click "Create Transfer Request"

2. **From Ward Transfers Page**:
   - Click "New Transfer" button
   - Select patient from dropdown
   - Current ward/bed auto-populates
   - Fill in remaining details
   - Submit the form

### Approving a Transfer

1. Navigate to Ward Transfers page
2. Find pending transfer
3. Click the approve icon (✓)
4. Confirm approval
5. Status changes to "Approved"

### Completing a Transfer

1. Navigate to Ward Transfers page
2. Find approved transfer
3. Click the complete icon (⇄)
4. Confirm completion
5. System automatically:
   - Updates patient's ward and bed
   - Decreases bed count in source ward
   - Increases bed count in destination ward
   - Sets status to "Completed"

### Cancelling a Transfer

1. Navigate to Ward Transfers page
2. Find pending transfer
3. Click the cancel icon (✗)
4. Confirm cancellation
5. Status changes to "Cancelled"

## Database Migration

### Setup Instructions

1. **Connect to Supabase**:
   - Open your Supabase project
   - Navigate to SQL Editor

2. **Run Migration**:
   ```sql
   -- Execute the contents of:
   sql/CREATE_WARD_TRANSFERS_TABLE.sql
   ```

3. **Verify Installation**:
   ```sql
   -- Check table exists
   SELECT * FROM ward_transfers LIMIT 1;
   
   -- Verify indexes
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'ward_transfers';
   ```

## Data Flow

### Transfer Creation
```
User Input → createWardTransfer() → Supabase INSERT → 
Update local state → Show success message
```

### Transfer Completion
```
User Confirms → completeWardTransfer() → 
Update transfer status → Update patient ward/bed → 
Update ward bed counts → Refresh local state
```

## Security Considerations

### Current Implementation (Development)
- Row Level Security (RLS) enabled
- Policy allows all operations (for development)

### Production Recommendations
⚠️ **Important**: Update RLS policies before production deployment

Suggested policies:
```sql
-- Only authenticated users can view transfers
CREATE POLICY "Users can view transfers"
ON ward_transfers FOR SELECT
USING (auth.role() = 'authenticated');

-- Only nurses and doctors can create transfers
CREATE POLICY "Staff can create transfers"
ON ward_transfers FOR INSERT
WITH CHECK (auth.role() IN ('nurse', 'doctor', 'admin'));

-- Only admins can approve transfers
CREATE POLICY "Admins can approve transfers"
ON ward_transfers FOR UPDATE
USING (auth.role() = 'admin');
```

## API Reference

### createWardTransfer(transferData)
Creates a new ward transfer request.

**Parameters**:
```javascript
{
  patientId: string,          // UUID of patient
  fromWardId: string,         // UUID of source ward
  toWardId: string,           // UUID of destination ward
  fromBedNumber: string,      // Current bed number
  toBedNumber: string,        // New bed number
  transferReason: string,     // Reason for transfer
  transferredBy: string,      // Name of person creating transfer
  transferredByRole: string,  // Role (Nurse/Doctor/Admin)
  status: 'Pending',          // Initial status
  notes: string               // Optional notes
}
```

**Returns**:
```javascript
{
  success: boolean,
  data: object,    // Transfer record if successful
  error: string    // Error message if failed
}
```

### completeWardTransfer(transferId, patientId, toWardId, toBedNumber)
Completes an approved transfer and updates patient location.

**Parameters**:
- `transferId` (string): UUID of transfer record
- `patientId` (string): UUID of patient
- `toWardId` (string): UUID of destination ward
- `toBedNumber` (string): New bed number

**Returns**:
```javascript
{
  success: boolean,
  data: object,    // Updated transfer record
  error: string    // Error message if failed
}
```

## UI Components

### Transfer Status Badges
- **Pending**: Yellow badge with clock icon
- **Approved**: Blue badge with checkmark icon
- **Completed**: Green badge with checkmark icon
- **Cancelled**: Red badge with X icon

### Action Buttons
- **View** (👁️): View transfer details
- **Approve** (✓): Approve pending transfer
- **Cancel** (✗): Cancel pending transfer
- **Complete** (⇄): Complete approved transfer
- **Delete** (🗑️): Delete completed/cancelled transfer

## Testing Checklist

- [ ] Create transfer request from Patients page
- [ ] Create transfer request from Ward Transfers page
- [ ] Search transfers by patient name
- [ ] Filter transfers by status
- [ ] Approve a pending transfer
- [ ] Complete an approved transfer
- [ ] Cancel a pending transfer
- [ ] Verify patient ward/bed updates after completion
- [ ] Verify ward bed counts update correctly
- [ ] View transfer details
- [ ] Delete completed transfer

## Future Enhancements

### Potential Features
1. **Email Notifications**: Notify staff when transfers are approved/completed
2. **Transfer History**: Patient-specific transfer history view
3. **Bulk Transfers**: Transfer multiple patients at once
4. **Transfer Scheduling**: Schedule transfers for future dates
5. **Transfer Reports**: Analytics and reporting on ward transfers
6. **Bed Availability Check**: Automatic validation of bed availability
7. **Transfer Approval Workflow**: Multi-level approval process
8. **Transfer Cancellation Reasons**: Track why transfers are cancelled

## Troubleshooting

### Common Issues

**Issue**: Transfer button not showing
- **Solution**: Ensure patient status is not "Discharged"

**Issue**: Cannot complete transfer
- **Solution**: Verify transfer status is "Approved"

**Issue**: Ward bed counts incorrect
- **Solution**: Check `updateWardBedCount()` function execution

**Issue**: Transfer not appearing in list
- **Solution**: Call `fetchWardTransfers()` to refresh data

## Support

For issues or questions:
1. Check the console for error messages
2. Verify database table exists and has correct schema
3. Ensure all required fields are filled in forms
4. Check Supabase connection and permissions

## Version History

### v1.0.0 (Current)
- Initial implementation
- Basic transfer workflow (Pending → Approved → Completed)
- Search and filter functionality
- Integration with patient management
- Automatic bed count updates
