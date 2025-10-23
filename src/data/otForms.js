// OT (Operation Theatre) Forms Configuration
// Maps OT form types to their image files in the ot folder

export const otForms = [
  {
    id: 'informed-consent-surgery',
    name: 'Informed Consent for Surgery & Procedures',
    category: 'OT',
    description: 'Patient consent for surgical procedures',
    pages: [
      '/ot/Informed_consent_for _sgry_&_prcd_eng_1.png',
      '/ot/Informed_consent_for_sgry_&_prcd_eng_2.png'
    ],
    requiredRole: ['Doctor', 'Surgeon']
  },
  {
    id: 'consent-anesthesia',
    name: 'Consent for Anesthesia & Sedation',
    category: 'OT',
    description: 'Patient consent for anesthesia and sedation',
    pages: [
      '/ot/consent_anesthesia_sedation_(eng).png'
    ],
    requiredRole: ['Anesthesiologist', 'Doctor']
  },
  {
    id: 'consent-surgical-procedures',
    name: 'Consent for Surgical Procedures',
    category: 'OT',
    description: 'General surgical procedures consent form',
    pages: [
      '/ot/consent_for_surg_prodrs_(eng)_1.png'
    ],
    requiredRole: ['Doctor', 'Surgeon']
  },
  {
    id: 'general-info-consent',
    name: 'General Information Consent',
    category: 'OT',
    description: 'General patient information and consent',
    pages: [
      '/ot/general_info_const_(eng)_1.png'
    ],
    requiredRole: ['Doctor', 'Nurse']
  },
  {
    id: 'high-risk-consent',
    name: 'High Risk Consent',
    category: 'OT',
    description: 'Consent form for high-risk procedures',
    pages: [
      '/ot/high_risk_consent.png',
      '/ot/high_risk_consent (2).png'
    ],
    requiredRole: ['Doctor', 'Surgeon']
  },
  {
    id: 'input-output-chart',
    name: 'Input Output Chart',
    category: 'OT',
    description: 'Track patient fluid input and output during surgery',
    pages: [
      '/ot/input_output_chart.png'
    ],
    requiredRole: ['Nurse', 'Anesthesiologist']
  },
  {
    id: 'operation-report',
    name: 'Operation Report',
    category: 'OT',
    description: 'Detailed surgical operation report',
    pages: [
      '/ot/operation report.png'
    ],
    requiredRole: ['Surgeon', 'Doctor']
  },
  {
    id: 'ot-nurse-monitoring',
    name: 'OT Nurse Monitoring',
    category: 'OT',
    description: 'Nursing monitoring during operation',
    pages: [
      '/ot/ot_nurse_monitrg.png'
    ],
    requiredRole: ['Nurse']
  },
  {
    id: 'pre-anaesthetic-assessment',
    name: 'Pre-Anaesthetic Assessment',
    category: 'OT',
    description: 'Pre-operative anesthesia assessment',
    pages: [
      '/ot/pre-anaesthetic_assessment_1.png',
      '/ot/pre-anaesthetic_assessment_2.png',
      '/ot/pre-anaesthetic_assessment_3.png',
      '/ot/pre-anaesthetic_assessment_4.png'
    ],
    requiredRole: ['Anesthesiologist']
  },
  {
    id: 'pre-operative-check-nurses',
    name: 'Pre-Operative Check for Nurses',
    category: 'OT',
    description: 'Pre-operative nursing checklist',
    pages: [
      '/ot/pre_opertve_check_for_nurses_(1).png',
      '/ot/pre_opertve_check_nurses_(2).png'
    ],
    requiredRole: ['Nurse']
  },
  {
    id: 'surgical-summary',
    name: 'Surgical Summary',
    category: 'OT',
    description: 'Summary of surgical procedure',
    pages: [
      '/ot/summary.png',
      '/ot/summary (2).png'
    ],
    requiredRole: ['Surgeon', 'Doctor']
  },
  {
    id: 'surgical-safety-checklist',
    name: 'Surgical Safety Checklist',
    category: 'OT',
    description: 'WHO surgical safety checklist',
    pages: [
      '/ot/surgical_safety_chklist.png'
    ],
    requiredRole: ['Nurse', 'Surgeon', 'Anesthesiologist']
  }
];

export const getOTFormById = (formId) => {
  return otForms.find(form => form.id === formId);
};

export const getOTFormsByRole = (role) => {
  return otForms.filter(form => form.requiredRole.includes(role));
};
