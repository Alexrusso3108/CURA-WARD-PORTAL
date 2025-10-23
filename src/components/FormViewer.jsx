import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Save, FileText, ZoomIn, ZoomOut } from 'lucide-react';

const FormViewer = ({ form, patient, onClose, onSave }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [notes, setNotes] = useState('');
  const [filledBy, setFilledBy] = useState('');
  const [filledByRole, setFilledByRole] = useState('Nurse');

  if (!form) return null;

  const totalPages = form.pages.length;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  const handleSave = () => {
    if (!filledBy.trim()) {
      alert('Please enter your name');
      return;
    }

    const formData = {
      patientId: patient.id,
      patientName: patient.name,
      formType: form.id,
      formName: form.name,
      filledBy: filledBy.trim(),
      filledByRole,
      notes: notes.trim(),
      status: 'Completed',
      completedAt: new Date().toISOString()
    };

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{form.name}</h2>
              <p className="text-sm text-gray-600">
                Patient: <span className="font-medium">{patient.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Image Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <img
              src={form.pages[currentPage]}
              alt={`${form.name} - Page ${currentPage + 1}`}
              style={{ width: `${zoom}%` }}
              className="shadow-lg bg-white"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="border-t bg-white p-4">
          {/* Zoom and Page Controls */}
          <div className="flex items-center justify-between mb-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-[100px]"></div> {/* Spacer for alignment */}
          </div>

          {/* Form Submission Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Filled By</label>
              <input
                type="text"
                value={filledBy}
                onChange={(e) => setFilledBy(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                value={filledByRole}
                onChange={(e) => setFilledByRole(e.target.value)}
                className="input-field"
              >
                <option value="Nurse">Nurse</option>
                <option value="Doctor">Doctor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
            <div>
              <label className="label">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                className="input-field"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormViewer;
