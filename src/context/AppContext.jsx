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
      .from('wards')
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
        .from('wards')
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
        .from('wards')
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
        .from('wards')
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
        .from('wards')
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
        .from('wards')
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
      .from('patient_forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setPatientForms(data.map(toCamelCase));
  };

  const addPatientForm = async (formData) => {
    try {
      const formRecord = toSnakeCase(formData);
      const { data, error } = await supabase
        .from('patient_forms')
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
      .from('ot_forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setOtForms(data.map(toCamelCase));
  };

  const addOtForm = async (formData) => {
    try {
      const formRecord = toSnakeCase(formData);
      const { data, error } = await supabase
        .from('ot_forms')
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

  const value = {
    wards,
    patients,
    staff,
    doctors,
    patientForms,
    otForms,
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
    refreshData: fetchAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
