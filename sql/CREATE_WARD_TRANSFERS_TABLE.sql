-- ================================================
-- WARD TRANSFERS TABLE CREATION
-- ================================================
-- This table tracks all patient transfers between wards
-- Maintains a complete audit trail of ward movements

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS ward_transfers CASCADE;

-- Create ward_transfers table
CREATE TABLE ward_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES ward_patients(id) ON DELETE CASCADE,
    from_ward_id UUID REFERENCES hospital_wards(id) ON DELETE SET NULL,
    to_ward_id UUID NOT NULL REFERENCES hospital_wards(id) ON DELETE SET NULL,
    from_bed_number TEXT,
    to_bed_number TEXT NOT NULL,
    transfer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transfer_reason TEXT NOT NULL,
    transferred_by TEXT NOT NULL,
    transferred_by_role TEXT NOT NULL,
    approved_by TEXT,
    approval_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_transfer_status CHECK (status IN ('Pending', 'Approved', 'Completed', 'Cancelled')),
    CONSTRAINT different_wards CHECK (from_ward_id != to_ward_id OR from_ward_id IS NULL)
);

-- Create indexes for better query performance
CREATE INDEX idx_ward_transfers_patient_id ON ward_transfers(patient_id);
CREATE INDEX idx_ward_transfers_from_ward ON ward_transfers(from_ward_id);
CREATE INDEX idx_ward_transfers_to_ward ON ward_transfers(to_ward_id);
CREATE INDEX idx_ward_transfers_status ON ward_transfers(status);
CREATE INDEX idx_ward_transfers_transfer_date ON ward_transfers(transfer_date DESC);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_ward_transfers_updated_at
    BEFORE UPDATE ON ward_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE ward_transfers ENABLE ROW LEVEL SECURITY;

-- Create policy for development (allow all operations)
-- ⚠️ For production, implement more restrictive policies
CREATE POLICY "Enable all operations for ward_transfers"
    ON ward_transfers
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add helpful comments
COMMENT ON TABLE ward_transfers IS 'Tracks patient transfers between wards with complete audit trail';
COMMENT ON COLUMN ward_transfers.patient_id IS 'Reference to the patient being transferred';
COMMENT ON COLUMN ward_transfers.from_ward_id IS 'Ward the patient is transferring from (NULL for new admissions)';
COMMENT ON COLUMN ward_transfers.to_ward_id IS 'Ward the patient is transferring to';
COMMENT ON COLUMN ward_transfers.from_bed_number IS 'Previous bed number';
COMMENT ON COLUMN ward_transfers.to_bed_number IS 'New bed number';
COMMENT ON COLUMN ward_transfers.transfer_reason IS 'Reason for the transfer';
COMMENT ON COLUMN ward_transfers.status IS 'Transfer status: Pending, Approved, Completed, Cancelled';

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Verify table creation
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_name = 'ward_transfers';

-- Verify columns
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ward_transfers'
ORDER BY ordinal_position;

-- Verify indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'ward_transfers';

-- Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'ward_transfers';
