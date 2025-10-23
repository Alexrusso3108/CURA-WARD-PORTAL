export const initialWards = [
  {
    id: '1',
    name: 'General Ward A',
    floor: 1,
    totalBeds: 20,
    occupiedBeds: 15,
    availableBeds: 5,
    department: 'General Medicine',
    nurseInCharge: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'ICU Ward',
    floor: 2,
    totalBeds: 10,
    occupiedBeds: 8,
    availableBeds: 2,
    department: 'Critical Care',
    nurseInCharge: 'Michael Chen'
  },
  {
    id: '3',
    name: 'Pediatric Ward',
    floor: 3,
    totalBeds: 15,
    occupiedBeds: 10,
    availableBeds: 5,
    department: 'Pediatrics',
    nurseInCharge: 'Emily Davis'
  },
  {
    id: '4',
    name: 'Surgical Ward',
    floor: 2,
    totalBeds: 18,
    occupiedBeds: 12,
    availableBeds: 6,
    department: 'Surgery',
    nurseInCharge: 'Robert Martinez'
  }
];

export const initialPatients = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    wardId: '1',
    bedNumber: 'A-101',
    admissionDate: '2024-01-15T10:30:00',
    diagnosis: 'Pneumonia',
    status: 'Admitted',
    doctor: 'Dr. Smith',
    emergencyContact: '+1-555-0101',
    bloodGroup: 'O+'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    wardId: '2',
    bedNumber: 'ICU-201',
    admissionDate: '2024-01-18T14:20:00',
    diagnosis: 'Post-operative care',
    status: 'Critical',
    doctor: 'Dr. Johnson',
    emergencyContact: '+1-555-0102',
    bloodGroup: 'A+'
  },
  {
    id: '3',
    name: 'Tommy Wilson',
    age: 8,
    gender: 'Male',
    wardId: '3',
    bedNumber: 'P-301',
    admissionDate: '2024-01-20T09:15:00',
    diagnosis: 'Appendicitis',
    status: 'Stable',
    doctor: 'Dr. Brown',
    emergencyContact: '+1-555-0103',
    bloodGroup: 'B+'
  },
  {
    id: '4',
    name: 'Mary Johnson',
    age: 58,
    gender: 'Female',
    wardId: '4',
    bedNumber: 'S-202',
    admissionDate: '2024-01-19T11:45:00',
    diagnosis: 'Hip replacement surgery',
    status: 'Recovering',
    doctor: 'Dr. Williams',
    emergencyContact: '+1-555-0104',
    bloodGroup: 'AB+'
  },
  {
    id: '5',
    name: 'Robert Brown',
    age: 67,
    gender: 'Male',
    wardId: '1',
    bedNumber: 'A-105',
    admissionDate: '2024-01-17T16:00:00',
    diagnosis: 'Diabetes management',
    status: 'Stable',
    doctor: 'Dr. Smith',
    emergencyContact: '+1-555-0105',
    bloodGroup: 'O-'
  }
];

export const initialStaff = [
  {
    id: '1',
    name: 'Dr. James Smith',
    role: 'Doctor',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    phone: '+1-555-1001',
    email: 'j.smith@hospital.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Dr. Lisa Johnson',
    role: 'Doctor',
    department: 'Critical Care',
    specialization: 'Intensive Care',
    phone: '+1-555-1002',
    email: 'l.johnson@hospital.com',
    shift: 'Evening',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'Nurse',
    department: 'General Medicine',
    specialization: 'General Nursing',
    phone: '+1-555-2001',
    email: 's.johnson@hospital.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Michael Chen',
    role: 'Nurse',
    department: 'Critical Care',
    specialization: 'ICU Nursing',
    phone: '+1-555-2002',
    email: 'm.chen@hospital.com',
    shift: 'Night',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Emily Davis',
    role: 'Nurse',
    department: 'Pediatrics',
    specialization: 'Pediatric Nursing',
    phone: '+1-555-2003',
    email: 'e.davis@hospital.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: '6',
    name: 'Dr. Robert Brown',
    role: 'Doctor',
    department: 'Pediatrics',
    specialization: 'Pediatrics',
    phone: '+1-555-1003',
    email: 'r.brown@hospital.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: '7',
    name: 'Dr. Amanda Williams',
    role: 'Doctor',
    department: 'Surgery',
    specialization: 'Orthopedic Surgery',
    phone: '+1-555-1004',
    email: 'a.williams@hospital.com',
    shift: 'Morning',
    status: 'Active'
  },
  {
    id: '8',
    name: 'Robert Martinez',
    role: 'Nurse',
    department: 'Surgery',
    specialization: 'Surgical Nursing',
    phone: '+1-555-2004',
    email: 'r.martinez@hospital.com',
    shift: 'Evening',
    status: 'Active'
  }
];
