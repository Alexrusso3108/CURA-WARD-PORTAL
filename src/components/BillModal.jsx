import React from 'react';
import Modal from './Modal';
import { Plus, Trash2 } from 'lucide-react';

const BillModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  billData, 
  setBillData,
  billItems,
  setBillItems,
  addBillItem,
  removeBillItem,
  updateBillItem,
  patients,
  editingBill,
  submitting,
  totals
}) => {
  const itemTypes = [
    'Room Charges', 'Consultation', 'Procedure', 'Medication',
    'Laboratory', 'Radiology', 'Surgery', 'Nursing Care',
    'Medical Supplies', 'Other'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBill ? 'Edit Bill' : 'Create New Bill'}
      size="xl"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div>
          <label className="label">Select Patient</label>
          <select
            value={billData.patientId}
            onChange={(e) => setBillData({...billData, patientId: e.target.value})}
            className="input-field"
            required
            disabled={editingBill}
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.diagnosis}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Admission Date</label>
            <input
              type="date"
              value={billData.admissionDate ? billData.admissionDate.split('T')[0] : ''}
              onChange={(e) => setBillData({...billData, admissionDate: e.target.value})}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Discharge Date</label>
            <input
              type="date"
              value={billData.dischargeDate ? billData.dischargeDate.split('T')[0] : ''}
              onChange={(e) => setBillData({...billData, dischargeDate: e.target.value})}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              value={billData.dueDate ? billData.dueDate.split('T')[0] : ''}
              onChange={(e) => setBillData({...billData, dueDate: e.target.value})}
              className="input-field"
            />
          </div>
        </div>

        {/* Bill Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="label mb-0">Bill Items</label>
            <button
              type="button"
              onClick={addBillItem}
              className="btn-secondary text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {billItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className="label text-xs">Item Type</label>
                    <select
                      value={item.itemType}
                      onChange={(e) => updateBillItem(index, 'itemType', e.target.value)}
                      className="input-field text-sm"
                      required
                    >
                      {itemTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="label text-xs">Item Name</label>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => updateBillItem(index, 'itemName', e.target.value)}
                      className="input-field text-sm"
                      required
                      placeholder="Item name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-xs">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateBillItem(index, 'quantity', e.target.value)}
                      className="input-field text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-xs">Unit Price</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateBillItem(index, 'unitPrice', e.target.value)}
                      className="input-field text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-xs">Amount</label>
                    <input
                      type="number"
                      value={item.amount}
                      className="input-field text-sm bg-gray-100"
                      disabled
                    />
                  </div>
                  {billItems.length > 1 && (
                    <div className="col-span-12 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeBillItem(index)}
                        className="text-red-600 hover:text-red-900 text-sm flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                  <div className="col-span-12">
                    <label className="label text-xs">Description (Optional)</label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateBillItem(index, 'description', e.target.value)}
                      className="input-field text-sm"
                      placeholder="Additional details"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax and Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Tax Percentage (%)</label>
            <input
              type="number"
              value={billData.taxPercentage}
              onChange={(e) => setBillData({...billData, taxPercentage: e.target.value})}
              className="input-field"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div>
            <label className="label">Discount Percentage (%)</label>
            <input
              type="number"
              value={billData.discountPercentage}
              onChange={(e) => setBillData({...billData, discountPercentage: e.target.value})}
              className="input-field"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Bill Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({billData.taxPercentage}%):</span>
              <span className="font-medium">₹{totals.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({billData.discountPercentage}%):</span>
              <span className="font-medium text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="font-bold text-lg text-primary-600">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Created By</label>
            <input
              type="text"
              value={billData.createdBy}
              onChange={(e) => setBillData({...billData, createdBy: e.target.value})}
              className="input-field"
              required
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label">Notes (Optional)</label>
            <input
              type="text"
              value={billData.notes || ''}
              onChange={(e) => setBillData({...billData, notes: e.target.value})}
              className="input-field"
              placeholder="Additional notes"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
            {submitting ? 'Saving...' : (editingBill ? 'Update Bill' : 'Create Bill')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BillModal;
