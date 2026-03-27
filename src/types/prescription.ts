// ============================================================
// PRESCRIPTION TYPES
// Defines all TypeScript interfaces used across the form.
// Each interface maps to a section of the HB+ Wellness form.
// ============================================================

/** A single prescribing physician option */
export interface Physician {
  id: string;
  name: string;
  regNumber: string;
  specialisation: string;
  /** Optional base64/URL for the physician's signature image */
  signature?: string;
}

/** One item inside the HB+ Services Prescribed section */
export interface PrescribedService {
  checked: boolean;
  sessionsPerWeek: string;
  /** Extra field varies by service — modifications, format, focus area, maxHR, etc. */
  extra1: string;
  extra2?: string;
}

/** Full form state shape */
export interface PrescriptionFormData {
  // --- Physician ---
  physicianId: string;

  // --- Header ---
  consultationNumber: string;

  // --- Patient Info ---
  clientName: string;
  age: string;
  gender: string;

  // --- Chief Complaint list ---
  chiefComplaints: string[];

  // --- Any conditions ---
  AnyCondition: string[];
  AnyConditionNotes: string;

  // --- Clinical Details ---
  keyBloodFlags: string;
  medicationsCurrentlyOn: string[];

  // --- Services Prescribed ---
  services: {
    strengthConditioning: PrescribedService;
    yogaMobility: PrescribedService & { format: string };
    physiotherapy: PrescribedService & { focusArea: string };
    mentalWellness: PrescribedService;
    nutritionProgramme: PrescribedService & { approach: string };
  };

  // --- Contraindications ---
  trainingContraindications: string;

  // --- 30-Day and 90-Day Targets ---
  target1: string;
  target2: string;
  target90_1: string;
  target90_2: string;
  target90_3: string;

  // --- Red Flags ---
  redFlags: string;

  // --- Authorization ---
  physicianSignatureFile: File | null;
  date: string;
}
