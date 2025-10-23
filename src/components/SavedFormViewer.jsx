import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut, Download, User, Calendar } from 'lucide-react';
import { getFormById } from '../data/monitoringForms';
import { format } from 'date-fns';

const SavedFormViewer = ({ savedForm, patient, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);

  if (!savedForm) return null;

  // Get the original form template using formId (if available) or fallback to formType
  const formTemplate = getFormById(savedForm.formId || savedForm.formType);
  if (!formTemplate) {
    console.error('Form template not found for:', savedForm.formId || savedForm.formType);
    return null;
  }

  const totalPages = formTemplate.pages.length;
  const currentPageKey = `page-${currentPage}`;
  const hasDrawing = savedForm.formData && savedForm.formData[currentPageKey];

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

  const handleDownload = () => {
    if (hasDrawing) {
      // Download the filled form with drawings
      const link = document.createElement('a');
      link.download = `${savedForm.formName}_${patient.name}_Page${currentPage + 1}_Filled.png`;
      link.href = savedForm.formData[currentPageKey];
      link.click();
    } else {
      // Download blank form
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = formTemplate.pages[currentPage];
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `${savedForm.formName}_${patient.name}_Page${currentPage + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{savedForm.formName}</h2>
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

        {/* Form Details */}
        <div className="px-4 py-3 bg-blue-50 border-b">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">
                  Filled by: <span className="font-medium">{savedForm.filledBy}</span> ({savedForm.filledByRole})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">
                  {format(new Date(savedForm.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              savedForm.status === 'Completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {savedForm.status}
            </span>
          </div>
          {savedForm.notes && (
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Notes:</span> {savedForm.notes}
            </p>
          )}
        </div>

        {/* Form Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <div style={{ width: `${zoom}%` }} className="relative inline-block">
              {hasDrawing ? (
                // Show filled form with drawings
                <img
                  src={savedForm.formData[currentPageKey]}
                  alt={`${savedForm.formName} - Page ${currentPage + 1} (Filled)`}
                  className="shadow-lg bg-white block"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                // Show blank form template
                <div className="relative">
                  <img
                    src={formTemplate.pages[currentPage]}
                    alt={`${savedForm.formName} - Page ${currentPage + 1}`}
                    className="shadow-lg bg-white block"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                    <div className="bg-white px-4 py-2 rounded shadow text-sm text-gray-600">
                      No drawings on this page
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center justify-between">
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

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                title="Download Page"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedFormViewer;
