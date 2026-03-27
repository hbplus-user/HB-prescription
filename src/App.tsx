// ============================================================
// App.tsx — Root Application Component
//
// This is the main entry point for the HB+ Wellness Prescription form.
// It owns the entire form state (PrescriptionFormData) and passes
// handlers down to each section component via props.
//
// Features:
//   - Preview: opens a modal with read-only prescription view
//   - Generate PDF: captures the preview via html2canvas + jsPDF
// ============================================================

import React, { useState, useEffect } from 'react';
import './App.css';
import type { PrescriptionFormData, Physician } from './types/prescription';
import PhysicianHeader from './components/PhysicianHeader/PhysicianHeader';
import PrescriptionHeader from './components/PrescriptionHeader/PrescriptionHeader';
import ChiefComplaint from './components/ChiefComplaint/ChiefComplaint';
import ServicesSection from './components/ServicesSection/ServicesSection';
import AuthorizationSection from './components/AuthorizationSection/AuthorizationSection';
import PreviewModal from './components/PreviewModal/PreviewModal';
import MultiSelect from './components/MultiSelect/MultiSelect';
import { PRIMARY_CONDITIONS } from './data/physicians';
import html2canvas from 'html2canvas';
import { fetchPhysicians, savePrescription } from './lib/prescriptionService';
import jsPDF from 'jspdf';

// ── Initial empty form state ────────────────────────────────
const getInitialFormData = (): PrescriptionFormData => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  return {
    physicianId: '',
    consultationNumber: '',
    clientName: '',
    age: '',
    gender: '',
    chiefComplaints: [''],
    AnyCondition: [],
    AnyConditionNotes: '',
    keyBloodFlags: '',
    medicationsCurrentlyOn: [''],
    services: {
      strengthConditioning: { checked: false, sessionsPerWeek: '', extra1: '' },
      yogaMobility: { checked: false, sessionsPerWeek: '', extra1: '', format: '' },
      physiotherapy: { checked: false, sessionsPerWeek: '', extra1: '', focusArea: '' },
      mentalWellness: { checked: false, sessionsPerWeek: '', extra1: '' },
      nutritionProgramme: {
        checked: false,
        sessionsPerWeek: '',
        extra1: '',
        approach: '',
      },
    },
    trainingContraindications: '',
    target1: '',
    target2: '',
    target90_1: '',
    target90_2: '',
    target90_3: '',
    redFlags: '',
    physicianSignatureFile: null,
    date: dateStr,
  };
};

// ────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [formData, setFormData] = useState<PrescriptionFormData>(getInitialFormData());
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [physiciansLoading, setPhysiciansLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPhysicians().then((data) => {
      setPhysicians(data);
      setPhysiciansLoading(false);
    }).catch(err => {
      console.error('Failed to load physicians globally:', err);
      setPhysiciansLoading(false);
      setToastMessage('Authentication or network error: Check API keys');
      setTimeout(() => setToastMessage(null), 5000);
    });
  }, []);

  // Look up the currently selected physician
  const selectedPhysician = physicians.find((p) => p.id === formData.physicianId);

  // ── Handlers ─────────────────────────────────────────────
  const handleChange = (field: keyof PrescriptionFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplaintsChange = (complaints: string[]) => {
    setFormData((prev) => ({ ...prev, chiefComplaints: complaints }));
  };

  const handleMedicationsChange = (medications: string[]) => {
    setFormData((prev) => ({ ...prev, medicationsCurrentlyOn: medications }));
  };

  const handleServiceChange = (
    service: keyof PrescriptionFormData['services'],
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: {
          ...prev.services[service],
          [field]: value,
        },
      },
    }));
  };

  // ── Preview ──────────────────────────────────────────────
  const handlePreview = () => {
    setShowPreview(true);
  };

  // ── Generate PDF ─────────────────────────────────────────
  // Uses html2canvas to capture the preview modal content,
  // then jsPDF to create a downloadable PDF file.
  const handleGeneratePDF = async () => {
    // Save to Supabase first
    setIsGenerating(true);
    try {
      await savePrescription(formData, formData.physicianId);
      setToastMessage('Saved to Supabase');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error('Supabase save error:', err);
      setToastMessage(`Save failed: ${err.message || 'Check database columns'}`);
      setTimeout(() => setToastMessage(null), 5000);
    }

    // First make sure preview is open so the content is in the DOM
    setShowPreview(true);

    // Wait for React to render the preview
    await new Promise((r) => setTimeout(r, 300));

    const element = document.getElementById('preview-print-area');
    if (!element) {
      alert('Could not find preview content. Please try again.');
      setIsGenerating(false);
      return;
    }

    try {
      // Add print mode class for a fixed A4-style layout during capture
      element.classList.add('pdf-print-mode');
      
      // Wait for layout to reflow
      await new Promise(resolve => setTimeout(resolve, 150));

      const sections = Array.from(element.querySelectorAll('.pdf-section')) as HTMLElement[];
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const pageCapacity = pageHeight - (margin * 2);

      let currentY = margin;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#f5f1ea',
          logging: false,
          width: section.offsetWidth || 774,
        });

        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If this section is too tall for current page space
        if (currentY + imgHeight > pageHeight - margin) {
          // If it fits on a fresh page, move it there
          if (imgHeight <= pageCapacity) {
            pdf.addPage();
            currentY = margin;
          } else {
            // Section is taller than a whole page (e.g. huge table), slice it
            let sectionRemainingHeight = imgHeight;
            let sectionSrcY = 0;
            const pxPerPage = (canvas.width * pageCapacity) / contentWidth;

            while (sectionRemainingHeight > 0) {
              const chunkCanvas = document.createElement('canvas');
              chunkCanvas.width = canvas.width;
              chunkCanvas.height = Math.min(pxPerPage, (canvas.height - sectionSrcY));
              
              const ctx = chunkCanvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(canvas, 0, sectionSrcY, canvas.width, chunkCanvas.height, 0, 0, canvas.width, chunkCanvas.height);
              }

              const chunkImgHeight = (chunkCanvas.height * contentWidth) / chunkCanvas.width;
              
              if (currentY + chunkImgHeight > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
              }

              pdf.addImage(chunkCanvas.toDataURL('image/png'), 'PNG', margin, currentY, contentWidth, chunkImgHeight);
              
              sectionRemainingHeight -= chunkImgHeight;
              sectionSrcY += pxPerPage;
              currentY += chunkImgHeight;
            }
            continue;
          }
        }

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 4; // 4mm gap between sections
      }

      // Remove print mode class
      element.classList.remove('pdf-print-mode');

      // Generate filename with consultation number and date
      const filename = `HB+_Prescription_${formData.consultationNumber || 'draft'}_${formData.date || 'undated'}.pdf`;
      pdf.save(filename);

      // Increment consultation counter in localStorage after successful generation
      const stored = localStorage.getItem('hbplus_consult_counter');
      const next = stored ? parseInt(stored, 10) + 1 : 1;
      localStorage.setItem('hbplus_consult_counter', String(next));

      // Update the current form with the next available number
      setFormData(prev => ({
        ...prev,
        consultationNumber: `HB+${String(next + 1).padStart(3, '0')}`
      }));
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="app-container">

      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          background: toastMessage === 'Save failed' ? '#ef4444' : '#22c55e',
          color: 'white',
          borderRadius: '6px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 500,
          fontFamily: 'inherit'
        }}>
          {toastMessage}
        </div>
      )}

      {/* ── 1. Physician selector header (dark navy) ── */}
      <PhysicianHeader
        physicianId={formData.physicianId}
        onChange={handleChange}
        physicians={physicians}
        physiciansLoading={physiciansLoading}
      />

      {/* ── 2. Prescription document header card ── */}
      <PrescriptionHeader
        consultationNumber={formData.consultationNumber}
        date={formData.date}
        onChange={handleChange}
      />

      {/* ── 3. Client Name / Age / Gender ── */}
      <div className="card">
        <div className="field-group">
          <span className="field-label">Client Name</span>
          <input
            type="text"
            className="full-width"
            value={formData.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
          />
        </div>
        <div className="field-row" style={{ marginTop: '20px' }}>
          <div className="field-group" style={{ flex: 1 }}>
            <span className="field-label">Age</span>
            <input
              type="text"
              className="full-width"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <span className="field-label">Gender</span>
            <select
              className="full-width"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 4. Chief Complaint ── */}
      <div className="card">
        <span className="field-label">Chief Complaint</span>
        <ChiefComplaint
          complaints={formData.chiefComplaints}
          onChange={handleComplaintsChange}
        />
      </div>

      {/* ── 5. Primary Condition / Goal ── */}
      <div className="card">
        <span className="field-label">Any conditions</span>
        <MultiSelect
          options={PRIMARY_CONDITIONS}
          selectedValues={formData.AnyCondition}
          onChange={(values) => handleChange('AnyCondition', values)}
          placeholder="Select conditions..."
        />
        <textarea
          className="full-width"
          style={{ marginTop: '12px' }}
          value={formData.AnyConditionNotes}
          placeholder="Additional notes..."
          onChange={(e) => handleChange('AnyConditionNotes', e.target.value)}
        />
      </div>

      {/* ── 6. Key Blood Flags ── */}
      <div className="card">
        <span className="field-label">Key Blood Flags (with values)</span>
        <textarea
          className="full-width"
          value={formData.keyBloodFlags}
          onChange={(e) => handleChange('keyBloodFlags', e.target.value)}
        />
      </div>

      {/* ── 7. Medications Currently On (numbered list, same as Chief Complaint) ── */}
      <div className="card">
        <span className="field-label">Medications Currently On</span>
        <ChiefComplaint
          complaints={formData.medicationsCurrentlyOn}
          onChange={handleMedicationsChange}
        />
      </div>

      {/* ── 8. HB+ Services Prescribed ── */}
      <div className="card">
        <span className="field-label">
          HB+ Services Prescribed (tick all that apply and note frequency)
        </span>
        <ServicesSection
          services={formData.services}
          onChange={handleServiceChange}
        />
      </div>

      {/* ── 9. Training Contraindications ── */}
      <div className="card card--dark">
        <span className="field-label field-label--light">
          Training Contraindications / Red Flags to Coach
        </span>
        <textarea
          className="full-width contraindications-textarea"
          value={formData.trainingContraindications}
          onChange={(e) => handleChange('trainingContraindications', e.target.value)}
        />
      </div>

      {/* ── 10. 30-Day Measurable Targets ── */}
      <div className="card">
        <span className="field-label">
          30-Day Measurable Targets (2 specific outcomes with values)
        </span>
        <div className="field-row" style={{ marginTop: '12px' }}>
          {(['target1', 'target2'] as const).map((t, i) => (
            <div className="field-group" key={t} style={{ flex: 1 }}>
              <span className="field-label" style={{ fontSize: '10px' }}>Goal {i + 1}</span>
              <input
                type="text"
                className="full-width"
                value={formData[t]}
                onChange={(e) => handleChange(t, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── 10.5. 90-Day Measurable Targets ── */}
      <div className="card">
        <span className="field-label">
          90-Day Measurable Targets (3 specific outcomes with values)
        </span>
        <div className="field-row" style={{ marginTop: '12px' }}>
          {(['target90_1', 'target90_2', 'target90_3'] as const).map((t, i) => (
            <div className="field-group" key={t} style={{ flex: 1 }}>
              <span className="field-label" style={{ fontSize: '10px' }}>Goal {i + 1}</span>
              <input
                type="text"
                className="full-width"
                value={formData[t]}
                onChange={(e) => handleChange(t, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── 11. Red Flags ── */}
      <div className="card">
        <span className="field-label">Red Flags — Contact GP / HB+ Team Immediately If</span>
        <textarea
          className="full-width"
          value={formData.redFlags}
          onChange={(e) => handleChange('redFlags', e.target.value)}
        />
      </div>

      {/* ── 12. Authorization ── */}
      <div className="card">
        <AuthorizationSection
          physicianSignature={selectedPhysician?.signature}
          date={formData.date}
          onChange={handleChange}
        />
      </div>

      {/* ── 13. Action Buttons ── */}
      <div className="form-actions">
        <button className="btn-outline" onClick={handlePreview}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview Prescription
        </button>
        <button className="btn-primary" onClick={handleGeneratePDF} disabled={isGenerating}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          {isGenerating ? 'Generating...' : 'Generate Prescription'}
        </button>
      </div>

      {/* ── Preview Modal (overlay) ── */}
      {showPreview && (
        <PreviewModal
          formData={formData}
          physician={selectedPhysician}
          onClose={() => setShowPreview(false)}
          onGeneratePDF={handleGeneratePDF}
        />
      )}
    </div>
  );
};

export default App;
