// Monitoring Forms Configuration
// Maps form types to their image files in the ward monitoring folder

import { otForms } from './otForms';

export const monitoringForms = [
  {
    id: 'vital-chart',
    name: 'Vital Signs Chart',
    category: 'Monitoring',
    description: 'Record patient vital signs including temperature, pulse, BP, respiratory rate',
    pages: [
      '/ward monitoring/vital_chart_1.png',
      '/ward monitoring/vital_chart_2.png'
    ],
    requiredRole: ['Nurse', 'Doctor']
  },
  {
    id: 'medication-chart',
    name: 'Medication Chart',
    category: 'Medication',
    description: 'Track medication administration and dosages',
    pages: [
      '/ward monitoring/medication_chart_1.png',
      '/ward monitoring/medication_chart_2.png'
    ],
    requiredRole: ['Nurse', 'Doctor']
  },
  {
    id: 'doctor-assessment',
    name: 'Doctor Initial Assessment',
    category: 'Assessment',
    description: 'Initial patient assessment by doctor',
    pages: [
      '/ward monitoring/doctor_initial_assessment_1.png',
      '/ward monitoring/doctor_initial_assessment_2.png',
      '/ward monitoring/doctor_initial_assessment_3.png',
      '/ward monitoring/doctor_initial_assessment_4.png'
    ],
    requiredRole: ['Doctor']
  },
  {
    id: 'blood-transfusion',
    name: 'Blood Transfusion Chart',
    category: 'Procedures',
    description: 'Blood transfusion monitoring and documentation',
    pages: [
      '/ward monitoring/blood_transfusion_chart_1.png',
      '/ward monitoring/blood_transfusion_chart_2.png'
    ],
    requiredRole: ['Nurse', 'Doctor']
  },
  {
    id: 'clinical-consent',
    name: 'Clinical Consent Form',
    category: 'Consent',
    description: 'Patient consent for clinical procedures',
    pages: [
      '/ward monitoring/clinical_consentt_1.png',
      '/ward monitoring/clilical_consent_2.png'
    ],
    requiredRole: ['Doctor']
  },
  {
    id: 'iv-care-bundle',
    name: 'IV Care Bundle',
    category: 'Procedures',
    description: 'IV line care and monitoring checklist',
    pages: [
      '/ward monitoring/iv_care_bundle_1.png',
      '/ward monitoring/iv_care_bundle_2.png',
      '/ward monitoring/iv_care_bundle_2 (2).png',
      '/ward monitoring/iv_care_bundle_2 (3).png',
      '/ward monitoring/iv_care_bundle_2 (4).png'
    ],
    requiredRole: ['Nurse']
  },
  {
    id: 'monitoring-evt',
    name: 'Monitoring EVT Hospital Stay',
    category: 'Monitoring',
    description: 'Extended hospital stay monitoring',
    pages: [
      '/ward monitoring/monitoring_evt_hsp_sty_1.png',
      '/ward monitoring/monitoring_evt_hsp_sty_2.png'
    ],
    requiredRole: ['Nurse', 'Doctor']
  },
  {
    id: 'nurses-notes',
    name: 'Nurses Notes',
    category: 'Documentation',
    description: 'Nursing observations and notes',
    pages: [
      '/ward monitoring/nurses_notes.png'
    ],
    requiredRole: ['Nurse']
  },
  {
    id: 'progress-notes',
    name: 'Progress Notes',
    category: 'Documentation',
    description: 'Patient progress documentation',
    pages: [
      '/ward monitoring/progress_notes.png'
    ],
    requiredRole: ['Doctor', 'Nurse']
  }
];

// Billing Forms Configuration
export const billingForms = [
  {
    id: 'ward-order',
    name: 'Ward Order Form',
    category: 'Billing',
    description: 'Ward billing and order documentation',
    pages: [
      '/WardBilling[1]/ward_order_1.png',
      '/WardBilling[1]/ward_order_2.png',
      '/WardBilling[1]/ward_order_3.png',
      '/WardBilling[1]/ward_order_4.png'
    ],
    requiredRole: ['Doctor', 'Administrator']
  }
];

export const formCategories = [
  'All',
  'Monitoring',
  'Medication',
  'Assessment',
  'Procedures',
  'Consent',
  'Documentation',
  'Billing',
  'OT'
];

// Combined forms array
export const allForms = [...monitoringForms, ...billingForms, ...otForms];

export const getFormById = (formId) => {
  return allForms.find(form => form.id === formId);
};

export const getFormsByCategory = (category) => {
  if (category === 'All') return allForms;
  return allForms.filter(form => form.category === category);
};
