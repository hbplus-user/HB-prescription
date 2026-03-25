// ============================================================
// PHYSICIANS DATA
// Static list of prescribing physicians.
// Each entry has an id, full name, registration number, and specialisation.
// To add a new physician, append an object to this array.
// ============================================================

import type { Physician } from '../types/prescription';

export const PHYSICIANS: Physician[] = [
  {
    id: '1',
    name: 'Dr. Rajiv Sharma',
    regNumber: 'MCI-10234',
    specialisation: 'Sports Medicine',
    // Placeholder SVG signature — replace with real base64 image if needed
    signature:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='50'%3E%3Cpath d='M10 40 Q30 10 50 35 T90 25 T130 38 L150 30' stroke='%231a2f4e' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: '2',
    name: 'Dr. Priya Mehta',
    regNumber: 'MCI-20987',
    specialisation: 'Internal Medicine',
    signature:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='50'%3E%3Cpath d='M10 35 Q40 5 70 30 T120 20 T155 32' stroke='%231a2f4e' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  {
    id: '3',
    name: 'Dr. Anand Verma',
    regNumber: 'MCI-30456',
    specialisation: 'Lifestyle Medicine',
    signature:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='50'%3E%3Cpath d='M10 38 C30 10 50 45 80 25 S120 10 150 35' stroke='%231a2f4e' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
];

// ============================================================
// PRIMARY CONDITIONS
// List of selectable conditions / goals for the prescription.
// Add or remove items here as needed.
// ============================================================
export const PRIMARY_CONDITIONS: string[] = [
  'Weight Management',
  'Diabetes Management',
  'Hypertension Control',
  'Cardiac Rehabilitation',
  'Musculoskeletal Rehab',
  'Mental Wellness',
  'General Fitness',
  'Post-Surgical Recovery',
  'Sports Performance',
  'Other',
];
