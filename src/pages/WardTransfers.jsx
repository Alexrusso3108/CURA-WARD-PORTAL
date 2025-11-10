import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRightLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

const WardTransfers = () => {
  const { 
    patients, 
    wards, 
    wardTransfers,
    createWardTransfer,
    completeWardTransfer,
    updateWardTransferStatus,
    deleteWardTransfer,
    fetchWardTransfers,
    loading 
  } = useApp();

  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    patientId: '',
    fromWardId: '',
    toWardId: '',
    fromBedNumber: '',
    toBedNumber: '',
    transferReason: '',
    transferredBy: '',
    transferredByRole: 'Nurse',
    status: 'Pending',
    notes: ''
  });

  // Fetch ward transfers on mount
  useEffect(() => {
    if (fetchWardTransfers) {
      fetchWardTransfers();
    }
  }, []);

  const handleOpenModal = () => {
    setFormData({
      patientId: '',
      fromWardId: '',
      toWardId: '',
      fromBedNumber: '',
      toBedNumber: '',
      transferReason: '',
      transferredBy: '',
      transferredByRole: 'Nurse',
      status: 'Pending',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewTransfer = (transfer) => {
    setSelectedTransfer(transfer);
    setIsViewModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-populate from ward and bed when patient is selected
    if (name === 'patientId' && value) {
      const patient = patients.find(p => p.id === value);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          fromWardId: patient.wardId || '',
          fromBedNumber: patient.bedNumber || ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createWardTransfer(formData);
      
      if (result.success) {
        handleCloseModal();
        alert('Ward transfer request created successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (transfer) => {
    if (window.confirm('Approve this transfer request?')) {
      const result = await updateWardTransferStatus(
        transfer.id, 
        'Approved', 
        'Admin' // In production, use actual user name
      );
      
      if (!result.success) {
        alert('Error approving transfer: ' + result.error);
      }
    }
  };

  const handleComplete = async (transfer) => {
    if (window.confirm('Complete this transfer? This will move the patient to the new ward.')) {
      const result = await completeWardTransfer(
        transfer.id,
        transfer.patientId,
        transfer.toWardId,
        transfer.toBedNumber
      );
      
      if (result.success) {
        alert('Transfer completed successfully!');
      } else {
        alert('Error completing transfer: ' + result.error);
      }
    }
  };

  const handleCancel = async (transfer) => {
    if (window.confirm('Cancel this transfer request?')) {
      const result = await updateWardTransferStatus(transfer.id, 'Cancelled');
      
      if (!result.success) {
        alert('Error cancelling transfer: ' + result.error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transfer record?')) {
      const result = await deleteWardTransfer(id);
      if (!result.success) {
        alert('Error deleting transfer: ' + result.error);
      }
    }
  };

  // Filter and search transfers
  const filteredTransfers = wardTransfers.filter(transfer => {
    const patient = patients.find(p => p.id === transfer.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.transferReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || transfer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled'];

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <Clock className="w-4 h-4" />,
      Approved: <CheckCircle className="w-4 h-4" />,
      Completed: <CheckCircle className="w-4 h-4" />,
      Cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return <LoadingSpinner message="Loading ward transfers..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ward Transfers</h1>
          <p className="text-gray-600 mt-1">Manage patient transfers between wards</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or reason..."
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

      {/* Transfers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => {
                const patient = patients.find(p => p.id === transfer.patientId);
                const fromWard = wards.find(w => w.id === transfer.fromWardId);
                const toWard = wards.find(w => w.id === transfer.toWardId);
                
                return (
                  <tr key={transfer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {patient?.name || 'Unknown Patient'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient?.age} years • {patient?.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="text-gray-900">
                          <div className="font-medium">{fromWard?.name || 'N/A'}</div>
                          <div className="text-gray-500">Bed {transfer.fromBedNumber || 'N/A'}</div>
                        </div>
                        <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        <div className="text-gray-900">
                          <div className="font-medium">{toWard?.name || 'N/A'}</div>
                          <div className="text-gray-500">Bed {transfer.toBedNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {transfer.transferReason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(transfer.status)}`}>
                        {getStatusIcon(transfer.status)}
                        <span>{transfer.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transfer.transferDate), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewTransfer(transfer)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {transfer.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(transfer)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Transfer"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(transfer)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Transfer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {transfer.status === 'Approved' && (
                          <button
                            onClick={() => handleComplete(transfer)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Complete Transfer"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(transfer.status === 'Cancelled' || transfer.status === 'Completed') && (
                          <button
                            onClick={() => handleDelete(transfer.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTransfers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No ward transfers found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Create Transfer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Ward Transfer"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Select Patient</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Patient</option>
              {patients.filter(p => p.status !== 'Discharged').map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {wards.find(w => w.id === patient.wardId)?.name || 'No Ward'} (Bed {patient.bedNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From Ward</label>
              <input
                type="text"
                value={wards.find(w => w.id === formData.fromWardId)?.name || 'N/A'}
                className="input-field bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="label">From Bed</label>
              <input
                type="text"
                value={formData.fromBedNumber || 'N/A'}
                className="input-field bg-gray-100"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">To Ward</label>
              <select
                name="toWardId"
                value={formData.toWardId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Ward</option>
                {wards.filter(w => w.id !== formData.fromWardId).map(ward => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name} ({ward.availableBeds} beds available)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">To Bed Number</label>
              <input
                type="text"
                name="toBedNumber"
                value={formData.toBedNumber}
                onChange={handleChange}
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
              value={formData.transferReason}
              onChange={handleChange}
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
                value={formData.transferredBy}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                name="transferredByRole"
                value={formData.transferredByRole}
                onChange={handleChange}
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
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              rows="2"
              placeholder="Any additional information..."
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
              {submitting ? 'Creating...' : 'Create Transfer Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Transfer Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Transfer Details"
        size="lg"
      >
        {selectedTransfer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Patient</label>
                <p className="text-gray-900">
                  {patients.find(p => p.id === selectedTransfer.patientId)?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedTransfer.status)}`}>
                  {getStatusIcon(selectedTransfer.status)}
                  <span>{selectedTransfer.status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">From Ward</label>
                <p className="text-gray-900">
                  {wards.find(w => w.id === selectedTransfer.fromWardId)?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Bed {selectedTransfer.fromBedNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">To Ward</label>
                <p className="text-gray-900">
                  {wards.find(w => w.id === selectedTransfer.toWardId)?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Bed {selectedTransfer.toBedNumber}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Transfer Reason</label>
              <p className="text-gray-900">{selectedTransfer.transferReason}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Transferred By</label>
                <p className="text-gray-900">{selectedTransfer.transferredBy}</p>
                <p className="text-sm text-gray-500">{selectedTransfer.transferredByRole}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Transfer Date</label>
                <p className="text-gray-900">
                  {format(new Date(selectedTransfer.transferDate), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {selectedTransfer.approvedBy && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="text-gray-900">{selectedTransfer.approvedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Approval Date</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedTransfer.approvalDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            )}

            {selectedTransfer.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{selectedTransfer.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WardTransfers;
