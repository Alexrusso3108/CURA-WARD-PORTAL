import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CriticalPatientsAlert = ({ criticalPatients, onClose }) => {
  const navigate = useNavigate();

  if (!criticalPatients || criticalPatients.length === 0) {
    return null;
  }

  const handleViewPatients = () => {
    navigate('/patients');
    if (onClose) onClose();
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-red-800">
              Critical Patient Alert
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-sm text-red-700">
            <p className="font-medium">
              {criticalPatients.length} patient{criticalPatients.length > 1 ? 's' : ''} in critical condition
            </p>
            <div className="mt-2 space-y-1">
              {criticalPatients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="font-medium">{patient.name}</span>
                  <span className="text-red-600">- {patient.diagnosis}</span>
                </div>
              ))}
              {criticalPatients.length > 3 && (
                <p className="text-xs text-red-600 mt-1">
                  +{criticalPatients.length - 3} more critical patient{criticalPatients.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <button
              onClick={handleViewPatients}
              className="text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              View all critical patients →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalPatientsAlert;
