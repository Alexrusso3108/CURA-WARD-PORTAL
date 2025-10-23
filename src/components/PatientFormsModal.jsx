import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Eye, Calendar, User } from 'lucide-react';
import { allForms, formCategories } from '../data/monitoringForms';
import DrawableFormViewer from './DrawableFormViewer';
import SavedFormViewer from './SavedFormViewer';
import { format } from 'date-fns';

const PatientFormsModal = ({ patient, isOpen, onClose, onSaveForm, existingForms = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedSavedForm, setSelectedSavedForm] = useState(null);
  const [viewMode, setViewMode] = useState('select'); // 'select' or 'view' or 'history' or 'viewSaved'

  if (!isOpen || !patient) return null;

  const filteredForms = selectedCategory === 'All'
    ? allForms
    : allForms.filter(form => form.category === selectedCategory);

  const patientForms = existingForms.filter(f => f.patientId === patient.id);

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setViewMode('view');
  };

  const handleSaveForm = async (formData) => {
    await onSaveForm(formData);
    setSelectedForm(null);
    setViewMode('history'); // Switch to history view to show the saved form
  };

  const handleCloseViewer = () => {
    setSelectedForm(null);
    setViewMode('select');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Monitoring Forms</h2>
              <p className="text-sm text-gray-600 mt-1">
                Patient: <span className="font-semibold">{patient.name}</span> | 
                Age: {patient.age} | 
                Ward: {patient.wardId ? 'Assigned' : 'Not Assigned'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setViewMode('select')}
              className={`px-6 py-3 font-medium transition-colors ${
                viewMode === 'select'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Form</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-6 py-3 font-medium transition-colors ${
                viewMode === 'history'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Form History ({patientForms.length})</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {viewMode === 'select' && (
              <>
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Forms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredForms.map(form => (
                    <div
                      key={form.id}
                      className="card hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleFormSelect(form)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {form.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {form.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                              {form.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {form.pages.length} page{form.pages.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {viewMode === 'history' && (
              <div className="space-y-4">
                {patientForms.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No forms submitted yet for this patient</p>
                  </div>
                ) : (
                  patientForms.map(form => (
                    <div 
                      key={form.id} 
                      className="card hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedSavedForm(form);
                        setViewMode('viewSaved');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <FileText className="w-6 h-6 text-primary-600 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{form.formName}</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>Filled by: {form.filledBy} ({form.filledByRole})</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(form.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                              {form.notes && (
                                <p className="text-gray-700 mt-2">
                                  <span className="font-medium">Notes:</span> {form.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          form.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {form.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t bg-gray-50">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Form Viewer */}
      {selectedForm && viewMode === 'view' && (
        <DrawableFormViewer
          form={selectedForm}
          patient={patient}
          onClose={handleCloseViewer}
          onSave={handleSaveForm}
        />
      )}

      {/* Saved Form Viewer */}
      {selectedSavedForm && viewMode === 'viewSaved' && (
        <SavedFormViewer
          savedForm={selectedSavedForm}
          patient={patient}
          onClose={() => {
            setSelectedSavedForm(null);
            setViewMode('history');
          }}
        />
      )}
    </>
  );
};

export default PatientFormsModal;
