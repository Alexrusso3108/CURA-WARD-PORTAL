-- ================================================
-- BILLING SYSTEM TABLES CREATION
-- ================================================
-- Complete billing system for Ward Management
-- Includes bills, bill items, and payments tracking

-- ================================================
-- 1. BILLS TABLE
-- ================================================
DROP TABLE IF EXISTS ward_bills CASCADE;

CREATE TABLE ward_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES ward_patients(id) ON DELETE CASCADE,
    admission_date TIMESTAMP WITH TIME ZONE,
    discharge_date TIMESTAMP WITH TIME ZONE,
    bill_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Financial Details
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    balance_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    -- Status and Metadata
    status TEXT NOT NULL DEFAULT 'Draft',
    payment_status TEXT NOT NULL DEFAULT 'Unpaid',
    payment_method TEXT,
    
    -- Additional Info
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_bill_status CHECK (status IN ('Draft', 'Finalized', 'Cancelled')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('Unpaid', 'Partially Paid', 'Paid', 'Overdue')),
    CONSTRAINT valid_amounts CHECK (
        subtotal >= 0 AND 
        tax_amount >= 0 AND 
        discount_amount >= 0 AND 
        total_amount >= 0 AND 
        paid_amount >= 0 AND 
        balance_amount >= 0
    )
);

-- Create indexes for bills
CREATE INDEX idx_ward_bills_patient_id ON ward_bills(patient_id);
CREATE INDEX idx_ward_bills_bill_number ON ward_bills(bill_number);
CREATE INDEX idx_ward_bills_status ON ward_bills(status);
CREATE INDEX idx_ward_bills_payment_status ON ward_bills(payment_status);
CREATE INDEX idx_ward_bills_bill_date ON ward_bills(bill_date DESC);
CREATE INDEX idx_ward_bills_due_date ON ward_bills(due_date);

-- ================================================
-- 2. BILL ITEMS TABLE
-- ================================================
DROP TABLE IF EXISTS ward_bill_items CASCADE;

CREATE TABLE ward_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES ward_bills(id) ON DELETE CASCADE,
    
    -- Item Details
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    
    -- Metadata
    service_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_item_type CHECK (item_type IN (
        'Room Charges', 
        'Consultation', 
        'Procedure', 
        'Medication', 
        'Laboratory', 
        'Radiology', 
        'Surgery', 
        'Nursing Care',
        'Medical Supplies',
        'Other'
    )),
    CONSTRAINT valid_item_amounts CHECK (
        quantity > 0 AND 
        unit_price >= 0 AND 
        amount >= 0
    )
);

-- Create indexes for bill items
CREATE INDEX idx_ward_bill_items_bill_id ON ward_bill_items(bill_id);
CREATE INDEX idx_ward_bill_items_item_type ON ward_bill_items(item_type);
CREATE INDEX idx_ward_bill_items_service_date ON ward_bill_items(service_date DESC);

-- ================================================
-- 3. PAYMENTS TABLE
-- ================================================
DROP TABLE IF EXISTS ward_payments CASCADE;

CREATE TABLE ward_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES ward_bills(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES ward_patients(id) ON DELETE CASCADE,
    
    -- Payment Details
    payment_number TEXT UNIQUE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    
    -- Transaction Details
    transaction_id TEXT,
    reference_number TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'Completed',
    
    -- Additional Info
    notes TEXT,
    received_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_payment_method CHECK (payment_method IN (
        'Cash', 
        'Credit Card', 
        'Debit Card', 
        'UPI', 
        'Net Banking', 
        'Cheque',
        'Insurance',
        'Other'
    )),
    CONSTRAINT valid_payment_status CHECK (status IN ('Completed', 'Pending', 'Failed', 'Refunded')),
    CONSTRAINT valid_payment_amount CHECK (amount > 0)
);

-- Create indexes for payments
CREATE INDEX idx_ward_payments_bill_id ON ward_payments(bill_id);
CREATE INDEX idx_ward_payments_patient_id ON ward_payments(patient_id);
CREATE INDEX idx_ward_payments_payment_number ON ward_payments(payment_number);
CREATE INDEX idx_ward_payments_payment_date ON ward_payments(payment_date DESC);
CREATE INDEX idx_ward_payments_payment_method ON ward_payments(payment_method);
CREATE INDEX idx_ward_payments_status ON ward_payments(status);

-- ================================================
-- 4. TRIGGERS
-- ================================================

-- Trigger for bills updated_at
CREATE TRIGGER update_ward_bills_updated_at
    BEFORE UPDATE ON ward_bills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bill items updated_at
CREATE TRIGGER update_ward_bill_items_updated_at
    BEFORE UPDATE ON ward_bill_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for payments updated_at
CREATE TRIGGER update_ward_payments_updated_at
    BEFORE UPDATE ON ward_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 5. ROW LEVEL SECURITY
-- ================================================

-- Enable RLS
ALTER TABLE ward_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_payments ENABLE ROW LEVEL SECURITY;

-- Create policies (Development - allow all)
CREATE POLICY "Enable all operations for ward_bills"
    ON ward_bills FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for ward_bill_items"
    ON ward_bill_items FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for ward_payments"
    ON ward_payments FOR ALL
    USING (true) WITH CHECK (true);

-- ================================================
-- 6. HELPER FUNCTIONS
-- ================================================

-- Function to generate bill number
CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get count of bills today
    SELECT COUNT(*) INTO counter
    FROM ward_bills
    WHERE DATE(bill_date) = CURRENT_DATE;
    
    -- Generate bill number: BILL-YYYYMMDD-XXXX
    new_number := 'BILL-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate payment number
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get count of payments today
    SELECT COUNT(*) INTO counter
    FROM ward_payments
    WHERE DATE(payment_date) = CURRENT_DATE;
    
    -- Generate payment number: PAY-YYYYMMDD-XXXX
    new_number := 'PAY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 7. COMMENTS
-- ================================================

COMMENT ON TABLE ward_bills IS 'Patient billing records with financial details';
COMMENT ON TABLE ward_bill_items IS 'Individual line items for each bill';
COMMENT ON TABLE ward_payments IS 'Payment transactions for bills';

COMMENT ON COLUMN ward_bills.bill_number IS 'Unique bill identifier';
COMMENT ON COLUMN ward_bills.payment_status IS 'Unpaid, Partially Paid, Paid, Overdue';
COMMENT ON COLUMN ward_bill_items.item_type IS 'Category of the billed item';
COMMENT ON COLUMN ward_payments.payment_method IS 'Method used for payment';

-- ================================================
-- 8. VERIFICATION QUERIES
-- ================================================

-- Verify tables creation
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('ward_bills', 'ward_bill_items', 'ward_payments');

-- Verify indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE tablename IN ('ward_bills', 'ward_bill_items', 'ward_payments')
ORDER BY tablename, indexname;

-- Verify functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('generate_bill_number', 'generate_payment_number');

-- Test bill number generation
SELECT generate_bill_number();

-- Test payment number generation
SELECT generate_payment_number();
