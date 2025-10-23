import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Edit2, Trash2, BedDouble, Users } from 'lucide-react';

const Wards = () => {
  const { wards, addWard, updateWard, deleteWard, loading } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    totalBeds: '',
    occupiedBeds: '',
    department: '',
    nurseInCharge: ''
  });

  const handleOpenModal = (ward = null) => {
    if (ward) {
      setEditingWard(ward);
      setFormData({
        name: ward.name,
        floor: ward.floor,
        totalBeds: ward.totalBeds,
        occupiedBeds: ward.occupiedBeds,
        department: ward.department,
        nurseInCharge: ward.nurseInCharge
      });
    } else {
      setEditingWard(null);
      setFormData({
        name: '',
        floor: '',
        totalBeds: '',
        occupiedBeds: '',
        department: '',
        nurseInCharge: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWard(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const totalBeds = parseInt(formData.totalBeds);
    const occupiedBeds = parseInt(formData.occupiedBeds);
    const availableBeds = totalBeds - occupiedBeds;

    const wardData = {
      ...formData,
      floor: parseInt(formData.floor),
      totalBeds,
      occupiedBeds,
      availableBeds
    };

    try {
      let result;
      if (editingWard) {
        result = await updateWard(editingWard.id, wardData);
      } else {
        result = await addWard(wardData);
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
    if (window.confirm('Are you sure you want to delete this ward?')) {
      const result = await deleteWard(id);
      if (!result.success) {
        alert('Error deleting ward: ' + result.error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading wards..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ward Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital wards and bed allocation</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Ward</span>
        </button>
      </div>

      {/* Wards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.map((ward) => {
          const occupancyRate = ((ward.occupiedBeds / ward.totalBeds) * 100).toFixed(0);
          return (
            <div key={ward.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{ward.name}</h3>
                  <p className="text-sm text-gray-500">Floor {ward.floor}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(ward)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ward.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium text-gray-900">{ward.department}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nurse in Charge</span>
                  <span className="font-medium text-gray-900">{ward.nurseInCharge}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BedDouble className="w-4 h-4" />
                      <span>Bed Occupancy</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        occupancyRate >= 90 ? 'bg-red-600' :
                        occupancyRate >= 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{ward.occupiedBeds} occupied</span>
                    <span>{ward.availableBeds} available</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Ward Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWard ? 'Edit Ward' : 'Add New Ward'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Ward Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="input-field"
                required
                min="1"
              />
            </div>
            <div>
              <label className="label">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Total Beds</label>
              <input
                type="number"
                name="totalBeds"
                value={formData.totalBeds}
                onChange={handleChange}
                className="input-field"
                required
                min="1"
              />
            </div>
            <div>
              <label className="label">Occupied Beds</label>
              <input
                type="number"
                name="occupiedBeds"
                value={formData.occupiedBeds}
                onChange={handleChange}
                className="input-field"
                required
                min="0"
                max={formData.totalBeds || 0}
              />
            </div>
          </div>

          <div>
            <label className="label">Nurse in Charge</label>
            <input
              type="text"
              name="nurseInCharge"
              value={formData.nurseInCharge}
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
              {submitting ? 'Saving...' : (editingWard ? 'Update Ward' : 'Add Ward')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Wards;
