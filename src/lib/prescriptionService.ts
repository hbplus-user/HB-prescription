import { supabase } from './supabase';
import type { Physician, PrescriptionFormData } from '../types/prescription';

export const fetchPhysicians = async (): Promise<Physician[]> => {
  const { data, error } = await supabase
    .from('physicians')
    .select('*');

  if (error) {
    console.error('Error fetching physicians:', error);
    return [];
  }

  // Map from snake_case DB to camelCase type
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    regNumber: row.reg_number,
    specialisation: row.specialisation,
    signature: row.signature_url,
  }));
};

export const savePrescription = async (formData: PrescriptionFormData, physicianId: string): Promise<void> => {
  const payload = {
    consultation_number: formData.consultationNumber,
    date: formData.date,
    physician_id: physicianId || null,
    client_name: formData.clientName,
    age: formData.age,
    gender: formData.gender,
    chief_complaints: formData.chiefComplaints,
    any_condition: formData.AnyCondition,
    any_condition_notes: formData.AnyConditionNotes,
    key_blood_flags: formData.keyBloodFlags,
    medications_currently_on: formData.medicationsCurrentlyOn,
    services: formData.services,
    training_contraindications: formData.trainingContraindications,
    target1: formData.target1,
    target2: formData.target2,
    target3: formData.target3,
    red_flags: formData.redFlags,
    client_acknowledgement: formData.clientAcknowledgement
  };

  const { error } = await supabase
    .from('prescriptions')
    .insert([payload]);

  if (error) {
    console.error('Error saving prescription:', error);
    throw error;
  }
};
