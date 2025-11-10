import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return obj;
  const newObj = {};
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  });
  return newObj;
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj) return obj;
  const newObj = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  });
  return newObj;
};

export const AppProvider = ({ children }) => {
  const [wards, setWards] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientForms, setPatientForms] = useState([]);
  const [otForms, setOtForms] = useState([]);
  const [wardTransfers, setWardTransfers] = useState([]);
  const [bills, setBills] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchWards(),
        fetchPatients(),
        fetchStaff(),
        fetchDoctors()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wards
  const fetchWards = async () => {
    const { data, error } = await supabase
      .from('hospital_wards')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    setWards(data.map(toCamelCase));
  };

  // Fetch patients
  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('ward_patients')
      .select('*')
      .order('admission_date', { ascending: false });
    
    if (error) throw error;
    setPatients(data.map(toCamelCase));
  };

  // Fetch staff
  const fetchStaff = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    setStaff(data.map(toCamelCase));
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    setDoctors(data.map(toCamelCase));
  };

  // Ward operations
  const addWard = async (ward) => {
    try {
      const wardData = toSnakeCase(ward);
      const { data, error } = await supabase
        .from('hospital_wards')
        .insert([wardData])
        .select()
        .single();
      
      if (error) throw error;
      setWards([...wards, toCamelCase(data)]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error adding ward:', err);
      return { success: false, error: err.message };
    }
  };

  const updateWard = async (id, updatedWard) => {
    try {
      const wardData = toSnakeCase(updatedWard);
      const { data, error } = await supabase
        .from('hospital_wards')
        .update(wardData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setWards(wards.map(ward => ward.id === id ? toCamelCase(data) : ward));
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error updating ward:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteWard = async (id) => {
    try {
      const { error } = await supabase
        .from('hospital_wards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setWards(wards.filter(ward => ward.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting ward:', err);
      return { success: false, error: err.message };
    }
  };

  // Helper function to update ward bed counts
  const updateWardBedCount = async (wardId, increment = true) => {
    try {
      // Get current ward data
      const { data: wardData, error: fetchError } = await supabase
        .from('hospital_wards')
        .select('*')
        .eq('id', wardId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new bed counts
      const occupiedBeds = increment 
        ? wardData.occupied_beds + 1 
        : Math.max(0, wardData.occupied_beds - 1);
      const availableBeds = wardData.total_beds - occupiedBeds;
      
      // Update ward
      const { data, error } = await supabase
        .from('hospital_wards')
        .update({ 
          occupied_beds: occupiedBeds,
          available_beds: availableBeds
        })
        .eq('id', wardId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setWards(wards.map(ward => ward.id === wardId ? toCamelCase(data) : ward));
      return { success: true };
    } catch (err) {
      console.error('Error updating ward bed count:', err);
      return { success: false, error: err.message };
    }
  };

  // Patient operations
  const addPatient = async (patient) => {
    try {
      const patientData = {
        ...toSnakeCase(patient),
        admission_date: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('ward_patients')
        .insert([patientData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update ward bed count if patient is admitted (not discharged)
      if (patient.status !== 'Discharged' && patient.wardId) {
        await updateWardBedCount(patient.wardId, true);
      }
      
      setPatients([toCamelCase(data), ...patients]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error adding patient:', err);
      return { success: false, error: err.message };
    }
  };

  const updatePatient = async (id, updatedPatient) => {
    try {
      // Get old patient data to check ward changes
      const oldPatient = patients.find(p => p.id === id);
      
      const patientData = toSnakeCase(updatedPatient);
      const { data, error } = await supabase
        .from('ward_patients')
        .update(patientData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Handle ward changes
      if (oldPatient) {
        const oldWardId = oldPatient.wardId;
        const newWardId = updatedPatient.wardId;
        const oldStatus = oldPatient.status;
        const newStatus = updatedPatient.status;
        
        // If ward changed and patient is not discharged
        if (oldWardId !== newWardId && newStatus !== 'Discharged') {
          // Decrease count in old ward
          if (oldWardId && oldStatus !== 'Discharged') {
            await updateWardBedCount(oldWardId, false);
          }
          // Increase count in new ward
          if (newWardId) {
            await updateWardBedCount(newWardId, true);
          }
        }
      }
      
      setPatients(patients.map(patient => patient.id === id ? toCamelCase(data) : patient));
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error updating patient:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePatient = async (id) => {
    try {
      // Get patient data before deletion to update ward
      const patient = patients.find(p => p.id === id);
      
      const { error } = await supabase
        .from('ward_patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Decrease ward bed count if patient was admitted
      if (patient && patient.wardId && patient.status !== 'Discharged') {
        await updateWardBedCount(patient.wardId, false);
      }
      
      setPatients(patients.filter(patient => patient.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting patient:', err);
      return { success: false, error: err.message };
    }
  };

  const dischargePatient = async (id) => {
    try {
      // Get patient data to update ward
      const patient = patients.find(p => p.id === id);
      
      const { data, error } = await supabase
        .from('ward_patients')
        .update({ 
          status: 'Discharged',
          discharge_date: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Decrease ward bed count when patient is discharged
      if (patient && patient.wardId && patient.status !== 'Discharged') {
        await updateWardBedCount(patient.wardId, false);
      }
      
      setPatients(patients.map(patient => patient.id === id ? toCamelCase(data) : patient));
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error discharging patient:', err);
      return { success: false, error: err.message };
    }
  };

  // Staff operations
  const addStaff = async (staffMember) => {
    try {
      const staffData = toSnakeCase(staffMember);
      const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();
      
      if (error) throw error;
      setStaff([...staff, toCamelCase(data)]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error adding staff:', err);
      return { success: false, error: err.message };
    }
  };

  const updateStaff = async (id, updatedStaff) => {
    try {
      const staffData = toSnakeCase(updatedStaff);
      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setStaff(staff.map(member => member.id === id ? toCamelCase(data) : member));
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error updating staff:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteStaff = async (id) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setStaff(staff.filter(member => member.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting staff:', err);
      return { success: false, error: err.message };
    }
  };

  // Patient Forms operations
  const fetchPatientForms = async () => {
    const { data, error } = await supabase
      .from('ward_patient_forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setPatientForms(data.map(toCamelCase));
  };

  const addPatientForm = async (formData) => {
    try {
      const formRecord = toSnakeCase(formData);
      const { data, error } = await supabase
        .from('ward_patient_forms')
        .insert([formRecord])
        .select()
        .single();
      
      if (error) throw error;
      setPatientForms([toCamelCase(data), ...patientForms]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error adding patient form:', err);
      return { success: false, error: err.message };
    }
  };

  // OT Forms operations
  const fetchOtForms = async () => {
    const { data, error } = await supabase
      .from('ward_ot_forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setOtForms(data.map(toCamelCase));
  };

  const addOtForm = async (formData) => {
    try {
      const formRecord = toSnakeCase(formData);
      const { data, error } = await supabase
        .from('ward_ot_forms')
        .insert([formRecord])
        .select()
        .single();
      
      if (error) throw error;
      setOtForms([toCamelCase(data), ...otForms]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error adding OT form:', err);
      return { success: false, error: err.message };
    }
  };

  // Ward Transfer operations
  const fetchWardTransfers = async () => {
    try {
      const { data, error } = await supabase
        .from('ward_transfers')
        .select('*')
        .order('transfer_date', { ascending: false });
      
      if (error) throw error;
      setWardTransfers(data.map(toCamelCase));
      return { success: true };
    } catch (err) {
      console.error('Error fetching ward transfers:', err);
      return { success: false, error: err.message };
    }
  };

  const createWardTransfer = async (transferData) => {
    try {
      const transferRecord = {
        ...toSnakeCase(transferData),
        transfer_date: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('ward_transfers')
        .insert([transferRecord])
        .select()
        .single();
      
      if (error) throw error;
      setWardTransfers([toCamelCase(data), ...wardTransfers]);
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error creating ward transfer:', err);
      return { success: false, error: err.message };
    }
  };

  const completeWardTransfer = async (transferId, patientId, toWardId, toBedNumber) => {
    try {
      // Update transfer status to Completed
      const { data: transferData, error: transferError } = await supabase
        .from('ward_transfers')
        .update({ 
          status: 'Completed',
          approval_date: new Date().toISOString()
        })
        .eq('id', transferId)
        .select()
        .single();
      
      if (transferError) throw transferError;

      // Get the transfer details to update ward bed counts
      const transfer = toCamelCase(transferData);
      
      // Update patient's ward and bed
      const { data: patientData, error: patientError } = await supabase
        .from('ward_patients')
        .update({
          ward_id: toWardId,
          bed_number: toBedNumber
        })
        .eq('id', patientId)
        .select()
        .single();
      
      if (patientError) throw patientError;

      // Update ward bed counts
      if (transfer.fromWardId) {
        await updateWardBedCount(transfer.fromWardId, false); // Decrease old ward
      }
      await updateWardBedCount(toWardId, true); // Increase new ward

      // Update local state
      setWardTransfers(wardTransfers.map(t => 
        t.id === transferId ? transfer : t
      ));
      setPatients(patients.map(p => 
        p.id === patientId ? toCamelCase(patientData) : p
      ));

      return { success: true, data: transfer };
    } catch (err) {
      console.error('Error completing ward transfer:', err);
      return { success: false, error: err.message };
    }
  };

  const updateWardTransferStatus = async (transferId, status, approvedBy = null) => {
    try {
      const updateData = { 
        status,
        ...(approvedBy && { 
          approved_by: approvedBy,
          approval_date: new Date().toISOString()
        })
      };

      const { data, error } = await supabase
        .from('ward_transfers')
        .update(updateData)
        .eq('id', transferId)
        .select()
        .single();
      
      if (error) throw error;
      
      setWardTransfers(wardTransfers.map(t => 
        t.id === transferId ? toCamelCase(data) : t
      ));
      
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error updating transfer status:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteWardTransfer = async (transferId) => {
    try {
      const { error } = await supabase
        .from('ward_transfers')
        .delete()
        .eq('id', transferId);
      
      if (error) throw error;
      
      setWardTransfers(wardTransfers.filter(t => t.id !== transferId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting ward transfer:', err);
      return { success: false, error: err.message };
    }
  };

  // Billing operations
  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('ward_bills')
        .select('*')
        .order('bill_date', { ascending: false });
      
      if (error) throw error;
      setBills(data.map(toCamelCase));
      return { success: true };
    } catch (err) {
      console.error('Error fetching bills:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchBillItems = async (billId) => {
    try {
      const { data, error } = await supabase
        .from('ward_bill_items')
        .select('*')
        .eq('bill_id', billId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data.map(toCamelCase) };
    } catch (err) {
      console.error('Error fetching bill items:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('ward_payments')
        .select('*')
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      setPayments(data.map(toCamelCase));
      return { success: true };
    } catch (err) {
      console.error('Error fetching payments:', err);
      return { success: false, error: err.message };
    }
  };

  const createBill = async (billData, items) => {
    try {
      // Generate bill number
      const { data: billNumberData } = await supabase.rpc('generate_bill_number');
      const billNumber = billNumberData || `BILL-${Date.now()}`;

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const taxAmount = (subtotal * parseFloat(billData.taxPercentage || 0)) / 100;
      const discountAmount = (subtotal * parseFloat(billData.discountPercentage || 0)) / 100;
      const totalAmount = subtotal + taxAmount - discountAmount;

      const billRecord = {
        ...toSnakeCase(billData),
        bill_number: billNumber,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        balance_amount: totalAmount,
        paid_amount: 0
      };

      // Insert bill
      const { data: bill, error: billError } = await supabase
        .from('ward_bills')
        .insert([billRecord])
        .select()
        .single();
      
      if (billError) throw billError;

      // Insert bill items
      const itemRecords = items.map(item => ({
        ...toSnakeCase(item),
        bill_id: bill.id
      }));

      const { error: itemsError } = await supabase
        .from('ward_bill_items')
        .insert(itemRecords);
      
      if (itemsError) throw itemsError;

      setBills([toCamelCase(bill), ...bills]);
      return { success: true, data: toCamelCase(bill) };
    } catch (err) {
      console.error('Error creating bill:', err);
      return { success: false, error: err.message };
    }
  };

  const updateBill = async (billId, billData, items) => {
    try {
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const taxAmount = (subtotal * parseFloat(billData.taxPercentage || 0)) / 100;
      const discountAmount = (subtotal * parseFloat(billData.discountPercentage || 0)) / 100;
      const totalAmount = subtotal + taxAmount - discountAmount;

      const currentBill = bills.find(b => b.id === billId);
      const balanceAmount = totalAmount - (currentBill?.paidAmount || 0);

      const billRecord = {
        ...toSnakeCase(billData),
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        balance_amount: balanceAmount
      };

      // Update bill
      const { data: bill, error: billError } = await supabase
        .from('ward_bills')
        .update(billRecord)
        .eq('id', billId)
        .select()
        .single();
      
      if (billError) throw billError;

      // Delete existing items
      await supabase
        .from('ward_bill_items')
        .delete()
        .eq('bill_id', billId);

      // Insert new items
      const itemRecords = items.map(item => ({
        ...toSnakeCase(item),
        bill_id: billId
      }));

      const { error: itemsError } = await supabase
        .from('ward_bill_items')
        .insert(itemRecords);
      
      if (itemsError) throw itemsError;

      setBills(bills.map(b => b.id === billId ? toCamelCase(bill) : b));
      return { success: true, data: toCamelCase(bill) };
    } catch (err) {
      console.error('Error updating bill:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteBill = async (billId) => {
    try {
      const { error } = await supabase
        .from('ward_bills')
        .delete()
        .eq('id', billId);
      
      if (error) throw error;
      
      setBills(bills.filter(b => b.id !== billId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting bill:', err);
      return { success: false, error: err.message };
    }
  };

  const addPayment = async (paymentData) => {
    try {
      // Generate payment number
      const { data: paymentNumberData } = await supabase.rpc('generate_payment_number');
      const paymentNumber = paymentNumberData || `PAY-${Date.now()}`;

      const paymentRecord = {
        ...toSnakeCase(paymentData),
        payment_number: paymentNumber
      };

      // Insert payment
      const { data: payment, error: paymentError } = await supabase
        .from('ward_payments')
        .insert([paymentRecord])
        .select()
        .single();
      
      if (paymentError) throw paymentError;

      // Update bill paid amount and balance
      const bill = bills.find(b => b.id === paymentData.billId);
      if (bill) {
        const newPaidAmount = parseFloat(bill.paidAmount) + parseFloat(paymentData.amount);
        const newBalanceAmount = parseFloat(bill.totalAmount) - newPaidAmount;
        
        let paymentStatus = 'Unpaid';
        if (newBalanceAmount <= 0) {
          paymentStatus = 'Paid';
        } else if (newPaidAmount > 0) {
          paymentStatus = 'Partially Paid';
        }

        const { data: updatedBill, error: billError } = await supabase
          .from('ward_bills')
          .update({
            paid_amount: newPaidAmount,
            balance_amount: newBalanceAmount,
            payment_status: paymentStatus
          })
          .eq('id', paymentData.billId)
          .select()
          .single();
        
        if (billError) throw billError;

        setBills(bills.map(b => b.id === paymentData.billId ? toCamelCase(updatedBill) : b));
      }

      setPayments([toCamelCase(payment), ...payments]);
      return { success: true, data: toCamelCase(payment) };
    } catch (err) {
      console.error('Error adding payment:', err);
      return { success: false, error: err.message };
    }
  };

  const finalizeBill = async (billId) => {
    try {
      const { data, error } = await supabase
        .from('ward_bills')
        .update({ status: 'Finalized' })
        .eq('id', billId)
        .select()
        .single();
      
      if (error) throw error;
      
      setBills(bills.map(b => b.id === billId ? toCamelCase(data) : b));
      return { success: true, data: toCamelCase(data) };
    } catch (err) {
      console.error('Error finalizing bill:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    wards,
    patients,
    staff,
    doctors,
    patientForms,
    otForms,
    wardTransfers,
    bills,
    billItems,
    payments,
    loading,
    error,
    addWard,
    updateWard,
    deleteWard,
    addPatient,
    updatePatient,
    deletePatient,
    dischargePatient,
    addStaff,
    updateStaff,
    deleteStaff,
    addPatientForm,
    fetchPatientForms,
    addOtForm,
    fetchOtForms,
    fetchWardTransfers,
    createWardTransfer,
    completeWardTransfer,
    updateWardTransferStatus,
    deleteWardTransfer,
    fetchBills,
    fetchBillItems,
    fetchPayments,
    createBill,
    updateBill,
    deleteBill,
    addPayment,
    finalizeBill,
    refreshData: fetchAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
