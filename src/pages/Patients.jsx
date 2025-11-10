import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import PatientFormsModal from '../components/PatientFormsModal';
import { Plus, Edit2, Trash2, UserCheck, Search, Filter, FileText, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';

const Patients = () => {
  const { patients, wards, doctors, patientForms, otForms, addPatient, updatePatient, deletePatient, dischargePatient, addPatientForm, addOtForm, fetchPatientForms, fetchOtForms, createWardTransfer, loading } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [selectedPatientForForms, setSelectedPatientForForms] = useState(null);
  const [isFormsModalOpen, setIsFormsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedPatientForTransfer, setSelectedPatientForTransfer] = useState(null);
  
  // Fetch patient forms and OT forms on mount
  useEffect(() => {
    if (fetchPatientForms) {
      fetchPatientForms();
    }
    if (fetchOtForms) {
      fetchOtForms();
    }
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    wardId: '',
    bedNumber: '',
    diagnosis: '',
    status: 'Admitted',
    doctor: '',
    emergencyContact: '',
    bloodGroup: ''
  });

  const [transferFormData, setTransferFormData] = useState({
    toWardId: '',
    toBedNumber: '',
    transferReason: '',
    transferredBy: '',
    transferredByRole: 'Nurse',
    notes: ''
  });

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        wardId: patient.wardId,
        bedNumber: patient.bedNumber,
        diagnosis: patient.diagnosis,
        status: patient.status,
        doctor: patient.doctor,
        emergencyContact: patient.emergencyContact,
        bloodGroup: patient.bloodGroup
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        wardId: '',
        bedNumber: '',
        diagnosis: '',
        status: 'Admitted',
        doctor: '',
        emergencyContact: '',
        bloodGroup: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const patientData = {
      ...formData,
      age: parseInt(formData.age)
    };

    try {
      let result;
      if (editingPatient) {
        result = await updatePatient(editingPatient.id, patientData);
      } else {
        result = await addPatient(patientData);
      }
      
      if (result.success) {
        handleCloseModal();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      const result = await deletePatient(id);
      if (!result.success) {
        alert('Error deleting patient: ' + result.error);
      }
    }
  };

  const handleDischarge = async (id) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      const result = await dischargePatient(id);
      if (!result.success) {
        alert('Error discharging patient: ' + result.error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTransferChange = (e) => {
    setTransferFormData({
      ...transferFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenTransferModal = (patient) => {
    setSelectedPatientForTransfer(patient);
    setTransferFormData({
      toWardId: '',
      toBedNumber: '',
      transferReason: '',
      transferredBy: '',
      transferredByRole: 'Nurse',
      notes: ''
    });
    setIsTransferModalOpen(true);
  };

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const transferData = {
        patientId: selectedPatientForTransfer.id,
        fromWardId: selectedPatientForTransfer.wardId,
        fromBedNumber: selectedPatientForTransfer.bedNumber,
        toWardId: transferFormData.toWardId,
        toBedNumber: transferFormData.toBedNumber,
        transferReason: transferFormData.transferReason,
        transferredBy: transferFormData.transferredBy,
        transferredByRole: transferFormData.transferredByRole,
        status: 'Pending',
        notes: transferFormData.notes
      };

      const result = await createWardTransfer(transferData);
      
      if (result.success) {
        setIsTransferModalOpen(false);
        setSelectedPatientForTransfer(null);
        alert('Transfer request created successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveForm = async (formData) => {
    // Determine if this is an OT form or patient form based on category
    const isOtForm = formData.formType === 'OT';
    const result = isOtForm 
      ? await addOtForm(formData) 
      : await addPatientForm(formData);
    
    if (result.success) {
      // Refresh the appropriate forms list
      if (isOtForm) {
        await fetchOtForms();
      } else {
        await fetchPatientForms();
      }
      alert('Form saved successfully!');
      // Don't close the modal so user can see the updated form history
    } else {
      alert('Error saving form: ' + result.error);
    }
  };

  // Filter and search patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = ['All', 'Admitted', 'Critical', 'Stable', 'Recovering', 'Discharged'];

  if (loading) {
    return <LoadingSpinner message="Loading patients..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">Manage patient records and admissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ward / Bed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => {
                const ward = wards.find(w => w.id === patient.wardId);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age} years • {patient.gender} • {patient.bloodGroup}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ward?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{patient.bedNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{patient.diagnosis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : 
                          patient.status === 'Stable' ? 'bg-green-100 text-green-800' : 
                          patient.status === 'Recovering' ? 'bg-yellow-100 text-yellow-800' : 
                          patient.status === 'Discharged' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(patient.admissionDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPatientForForms(patient);
                            setIsFormsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Monitoring Forms"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {patient.status !== 'Discharged' && (
                          <>
                            <button
                              onClick={() => handleOpenTransferModal(patient)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Transfer Ward"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDischarge(patient.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Discharge Patient"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenModal(patient)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit Patient"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No patients found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Patient Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input-field"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ward</label>
              <select
                name="wardId"
                value={formData.wardId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Ward</option>
                {wards.map(ward => (
                  <option key={ward.id} value={ward.id}>{ward.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Bed Number</label>
              <input
                type="text"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Diagnosis</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="input-field"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Admitted">Admitted</option>
                <option value="Critical">Critical</option>
                <option value="Stable">Stable</option>
                <option value="Recovering">Recovering</option>
              </select>
            </div>
            <div>
              <label className="label">Attending Doctor</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingPatient ? 'Update Patient' : 'Add Patient')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient Forms Modal */}
      <PatientFormsModal
        patient={selectedPatientForForms}
        isOpen={isFormsModalOpen}
        onClose={() => {
          setIsFormsModalOpen(false);
          setSelectedPatientForForms(null);
        }}
        onSaveForm={handleSaveForm}
        existingForms={[...patientForms, ...otForms]}
      />

      {/* Transfer Patient Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedPatientForTransfer(null);
        }}
        title="Transfer Patient to Another Ward"
        size="lg"
      >
        {selectedPatientForTransfer && (
          <form onSubmit={handleSubmitTransfer} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Patient Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>{selectedPatientForTransfer.name}</strong> • {selectedPatientForTransfer.age} years • {selectedPatientForTransfer.gender}
              </p>
              <p className="text-sm text-gray-600">
                Current Ward: <strong>{wards.find(w => w.id === selectedPatientForTransfer.wardId)?.name || 'N/A'}</strong> • Bed: <strong>{selectedPatientForTransfer.bedNumber}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Transfer to Ward</label>
                <select
                  name="toWardId"
                  value={transferFormData.toWardId}
                  onChange={handleTransferChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.filter(w => w.id !== selectedPatientForTransfer.wardId).map(ward => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name} ({ward.availableBeds} beds available)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">New Bed Number</label>
                <input
                  type="text"
                  name="toBedNumber"
                  value={transferFormData.toBedNumber}
                  onChange={handleTransferChange}
                  className="input-field"
                  required
                  placeholder="e.g., B-101"
                />
              </div>
            </div>

            <div>
              <label className="label">Transfer Reason</label>
              <textarea
                name="transferReason"
                value={transferFormData.transferReason}
                onChange={handleTransferChange}
                className="input-field"
                rows="3"
                required
                placeholder="Describe the reason for transfer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Transferred By</label>
                <input
                  type="text"
                  name="transferredBy"
                  value={transferFormData.transferredBy}
                  onChange={handleTransferChange}
                  className="input-field"
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  name="transferredByRole"
                  value={transferFormData.transferredByRole}
                  onChange={handleTransferChange}
                  className="input-field"
                  required
                >
                  <option value="Nurse">Nurse</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={transferFormData.notes}
                onChange={handleTransferChange}
                className="input-field"
                rows="2"
                placeholder="Any additional information..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setSelectedPatientForTransfer(null);
                }}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Transfer Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Patients;
