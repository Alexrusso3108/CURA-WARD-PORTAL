# Billing System Documentation

## Overview
The Billing System provides comprehensive financial management for the Ward Management System, including bill creation, payment tracking, and invoice generation.

## Features Implemented

### 1. Database Schema

#### Tables Created
- **`ward_bills`** - Main billing records
- **`ward_bill_items`** - Individual line items for each bill
- **`ward_payments`** - Payment transaction records

#### ward_bills Table Structure
```sql
- id (UUID, Primary Key)
- bill_number (TEXT, Unique) - Auto-generated
- patient_id (UUID, Foreign Key)
- admission_date, discharge_date, bill_date, due_date
- subtotal, tax_amount, tax_percentage
- discount_amount, discount_percentage
- total_amount, paid_amount, balance_amount
- status (Draft, Finalized, Cancelled)
- payment_status (Unpaid, Partially Paid, Paid, Overdue)
- payment_method, notes, created_by
```

#### ward_bill_items Table Structure
```sql
- id (UUID, Primary Key)
- bill_id (UUID, Foreign Key)
- item_type (Room Charges, Consultation, Procedure, etc.)
- item_name, description
- quantity, unit_price, amount
- service_date
```

#### ward_payments Table Structure
```sql
- id (UUID, Primary Key)
- bill_id (UUID, Foreign Key)
- patient_id (UUID, Foreign Key)
- payment_number (TEXT, Unique) - Auto-generated
- payment_date, amount
- payment_method (Cash, Card, UPI, etc.)
- transaction_id, reference_number
- status (Completed, Pending, Failed, Refunded)
- notes, received_by
```

### 2. Backend Functions (AppContext)

#### State Management
- `bills` - Array of all bills
- `billItems` - Array of bill items
- `payments` - Array of all payments

#### Functions
- **`fetchBills()`** - Retrieve all bills
- **`fetchBillItems(billId)`** - Get items for a specific bill
- **`fetchPayments()`** - Retrieve all payments
- **`createBill(billData, items)`** - Create new bill with items
- **`updateBill(billId, billData, items)`** - Update existing bill
- **`deleteBill(billId)`** - Delete a bill
- **`addPayment(paymentData)`** - Record a payment
- **`finalizeBill(billId)`** - Finalize a draft bill

### 3. User Interface

#### Billing Page (`/billing`)
**Location**: `src/pages/Billing.jsx`

**Features**:
- View all bills in a table format
- Search by patient name or bill number
- Filter by payment status
- Create new bills with multiple line items
- Edit draft bills
- View detailed bill information
- Record payments
- Finalize bills
- Print invoices
- Delete draft bills

**Bill Status Workflow**:
1. **Draft** → Editable, can be modified
2. **Finalized** → Locked, cannot be edited
3. **Cancelled** → Cancelled bills

**Payment Status**:
- **Unpaid** → No payments received
- **Partially Paid** → Some payment received
- **Paid** → Fully paid
- **Overdue** → Past due date

#### Bill Modal Component
**Location**: `src/components/BillModal.jsx`

**Features**:
- Patient selection
- Multiple bill items with dynamic addition/removal
- Item types: Room Charges, Consultation, Procedure, Medication, Laboratory, Radiology, Surgery, Nursing Care, Medical Supplies, Other
- Automatic amount calculation
- Tax and discount percentage
- Real-time bill summary
- Date management (admission, discharge, due date)

### 4. Navigation
- Added "Billing" menu item in sidebar
- Icon: Receipt (from lucide-react)
- Route: `/billing`

## Usage Workflow

### Creating a Bill

1. **Navigate to Billing Page**:
   - Click "Billing" in sidebar
   - Click "Create Bill" button

2. **Fill Bill Information**:
   - Select patient
   - Enter dates (admission, discharge, due date)
   - Add bill items:
     - Select item type
     - Enter item name and description
     - Specify quantity and unit price
     - Amount auto-calculates
   - Add more items as needed
   - Set tax percentage (if applicable)
   - Set discount percentage (if applicable)
   - Enter your name as creator
   - Add notes (optional)

3. **Review Bill Summary**:
   - Check subtotal
   - Verify tax amount
   - Confirm discount
   - Review total amount

4. **Submit**:
   - Click "Create Bill"
   - Bill is created in Draft status

### Editing a Bill

1. Find the bill in the list
2. Click the edit icon (✏️)
3. Modify details as needed
4. Click "Update Bill"

**Note**: Only Draft bills can be edited

### Finalizing a Bill

1. Find the draft bill
2. Click the finalize icon (✓)
3. Confirm finalization
4. Bill status changes to "Finalized"

**Important**: Finalized bills cannot be edited

### Recording a Payment

1. **Find the Bill**:
   - Locate bill with outstanding balance
   - Click the payment icon (💵)

2. **Enter Payment Details**:
   - Enter payment amount (max: balance due)
   - Select payment method
   - Add transaction ID (optional)
   - Add reference number (optional)
   - Enter your name as receiver
   - Add notes (optional)

3. **Submit Payment**:
   - Click "Record Payment"
   - Payment is recorded
   - Bill balance updates automatically
   - Payment status updates:
     - Partially Paid (if balance remains)
     - Paid (if fully paid)

### Viewing Bill Details

1. Click the view icon (👁️) on any bill
2. See complete bill information:
   - Bill number and dates
   - Patient details
   - All bill items with quantities and prices
   - Financial summary
   - Payment status

### Printing an Invoice

1. Click the print icon (🖨️) on any bill
2. Browser print dialog opens
3. Print or save as PDF

## Item Types

The system supports the following billable item categories:

1. **Room Charges** - Daily ward/room fees
2. **Consultation** - Doctor consultation fees
3. **Procedure** - Medical procedures
4. **Medication** - Medicines and drugs
5. **Laboratory** - Lab tests and diagnostics
6. **Radiology** - X-rays, CT scans, MRI, etc.
7. **Surgery** - Surgical procedures
8. **Nursing Care** - Nursing services
9. **Medical Supplies** - Medical equipment and supplies
10. **Other** - Miscellaneous charges

## Payment Methods

Supported payment methods:
- Cash
- Credit Card
- Debit Card
- UPI
- Net Banking
- Cheque
- Insurance
- Other

## Automatic Calculations

### Bill Totals
```
Subtotal = Sum of all item amounts
Tax Amount = Subtotal × (Tax Percentage / 100)
Discount Amount = Subtotal × (Discount Percentage / 100)
Total Amount = Subtotal + Tax Amount - Discount Amount
```

### Item Amount
```
Amount = Quantity × Unit Price
```

### Balance Tracking
```
Balance Amount = Total Amount - Paid Amount
```

### Payment Status Logic
- If Paid Amount = 0 → **Unpaid**
- If 0 < Paid Amount < Total Amount → **Partially Paid**
- If Paid Amount >= Total Amount → **Paid**

## Bill Number Generation

Bills are automatically assigned unique numbers:
- Format: `BILL-YYYYMMDD-XXXX`
- Example: `BILL-20251110-0001`
- XXXX is a 4-digit counter reset daily

## Payment Number Generation

Payments are automatically assigned unique numbers:
- Format: `PAY-YYYYMMDD-XXXX`
- Example: `PAY-20251110-0001`
- XXXX is a 4-digit counter reset daily

## Database Migration

### Setup Instructions

1. **Connect to Supabase**:
   - Open your Supabase project
   - Navigate to SQL Editor

2. **Run Migration**:
   ```sql
   -- Execute the contents of:
   sql/CREATE_BILLING_TABLES.sql
   ```

3. **Verify Installation**:
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('ward_bills', 'ward_bill_items', 'ward_payments');
   
   -- Test bill number generation
   SELECT generate_bill_number();
   
   -- Test payment number generation
   SELECT generate_payment_number();
   ```

## API Reference

### createBill(billData, items)
Creates a new bill with line items.

**Parameters**:
```javascript
billData = {
  patientId: string,
  admissionDate: string,
  dischargeDate: string,
  dueDate: string,
  taxPercentage: number,
  discountPercentage: number,
  notes: string,
  createdBy: string,
  status: 'Draft'
}

items = [{
  itemType: string,
  itemName: string,
  description: string,
  quantity: number,
  unitPrice: number,
  amount: number
}]
```

**Returns**:
```javascript
{
  success: boolean,
  data: object,    // Bill record if successful
  error: string    // Error message if failed
}
```

### addPayment(paymentData)
Records a payment against a bill.

**Parameters**:
```javascript
{
  billId: string,
  patientId: string,
  amount: number,
  paymentMethod: string,
  transactionId: string,
  referenceNumber: string,
  notes: string,
  receivedBy: string
}
```

**Returns**:
```javascript
{
  success: boolean,
  data: object,    // Payment record if successful
  error: string    // Error message if failed
}
```

## Security Considerations

### Current Implementation (Development)
- Row Level Security (RLS) enabled
- Policies allow all operations (for development)

### Production Recommendations
⚠️ **Important**: Update RLS policies before production deployment

Suggested policies:
```sql
-- Only authenticated users can view bills
CREATE POLICY "Users can view bills"
ON ward_bills FOR SELECT
USING (auth.role() = 'authenticated');

-- Only billing staff can create bills
CREATE POLICY "Billing staff can create bills"
ON ward_bills FOR INSERT
WITH CHECK (auth.role() IN ('billing', 'admin'));

-- Only admins can finalize bills
CREATE POLICY "Admins can finalize bills"
ON ward_bills FOR UPDATE
USING (auth.role() = 'admin');

-- Only billing staff can record payments
CREATE POLICY "Billing staff can record payments"
ON ward_payments FOR INSERT
WITH CHECK (auth.role() IN ('billing', 'admin'));
```

## Reports and Analytics

### Available Data Points
- Total revenue
- Outstanding balances
- Payment method distribution
- Item type revenue breakdown
- Patient billing history
- Daily/monthly revenue trends

### Future Enhancements
- Revenue dashboard
- Aging reports (overdue bills)
- Payment collection reports
- Item-wise revenue analysis
- Insurance claim tracking

## Testing Checklist

- [ ] Create a new bill with multiple items
- [ ] Edit a draft bill
- [ ] Finalize a bill
- [ ] Record a partial payment
- [ ] Record full payment
- [ ] View bill details
- [ ] Search bills by patient name
- [ ] Filter bills by payment status
- [ ] Print an invoice
- [ ] Delete a draft bill
- [ ] Verify automatic calculations
- [ ] Test bill number generation
- [ ] Test payment number generation

## Troubleshooting

### Common Issues

**Issue**: Bill number not generating
- **Solution**: Ensure `generate_bill_number()` function exists in database

**Issue**: Cannot edit finalized bill
- **Solution**: This is by design. Only draft bills can be edited

**Issue**: Payment not updating bill balance
- **Solution**: Check `addPayment()` function execution

**Issue**: Totals not calculating correctly
- **Solution**: Verify tax and discount percentages are numbers, not strings

## Integration Points

### With Patient Management
- Bills are linked to patients via `patient_id`
- Patient information displayed on bills
- Can create bills directly from patient records

### With Ward Management
- Room charges can be auto-calculated based on ward stay
- Ward information available for billing

## Future Enhancements

### Potential Features
1. **Auto-Bill Generation**: Automatically create bills on patient discharge
2. **Recurring Charges**: Daily room charges auto-added
3. **Insurance Integration**: Submit claims to insurance providers
4. **Email Invoices**: Send bills via email
5. **SMS Notifications**: Payment reminders
6. **Bulk Payments**: Process multiple payments at once
7. **Refund Management**: Handle payment refunds
8. **Credit Notes**: Issue credit notes for adjustments
9. **Payment Plans**: Installment payment options
10. **GST Compliance**: Detailed tax breakdowns

## Best Practices

1. **Always finalize bills** before accepting payments
2. **Record payments immediately** after receiving them
3. **Include detailed descriptions** for all bill items
4. **Set due dates** appropriately
5. **Review bills** before finalization
6. **Keep transaction IDs** for all electronic payments
7. **Add notes** for special circumstances
8. **Regular reconciliation** of payments

## Support

For issues or questions:
1. Check the console for error messages
2. Verify database tables exist and have correct schema
3. Ensure all required fields are filled in forms
4. Check Supabase connection and permissions

## Version History

### v1.0.0 (Current)
- Initial implementation
- Bill creation and management
- Payment recording
- Multiple item types
- Tax and discount support
- Auto-number generation
- Search and filter functionality
- Print capability

---

**Currency**: All amounts are in Indian Rupees (₹)
**Date Format**: MMM dd, yyyy (e.g., Nov 10, 2025)
**Number Format**: 2 decimal places for all amounts
