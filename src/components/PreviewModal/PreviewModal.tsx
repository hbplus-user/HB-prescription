// ============================================================
// PreviewModal Component
// Renders a full-screen overlay with a clean, read-only preview
// that matches the HB+ reference prescription layout.
//
// Design elements (matching reference):
//   - Centred title + company info
//   - Section cards with left orange accent bar
//   - 2-column physician grid
//   - 3-column bordered target boxes
//   - Centred authorization row at bottom
//   - Red disclaimer text
// ============================================================

import React, { useRef } from 'react';
import './PreviewModal.css';
import type { PrescriptionFormData } from '../../types/prescription';
import type { Physician } from '../../types/prescription';

interface PreviewModalProps {
  formData: PrescriptionFormData;
  physician: Physician | undefined;
  onClose: () => void;
  onGeneratePDF: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  formData,
  physician,
  onClose,
  onGeneratePDF,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // ── Collect checked services ──
  const checkedServices: { name: string; details: string }[] = [];
  const s = formData.services;
  if (s.strengthConditioning.checked) {
    checkedServices.push({
      name: 'Strength & Conditioning',
      details: `${s.strengthConditioning.sessionsPerWeek || '—'} sessions/wk · Mods: ${s.strengthConditioning.extra1 || '—'}`,
    });
  }
  if (s.yogaMobility.checked) {
    checkedServices.push({
      name: 'Yoga & Mobility',
      details: `${s.yogaMobility.sessionsPerWeek || '—'} sessions/wk · Format: ${s.yogaMobility.format || '—'}`,
    });
  }
  if (s.physiotherapy.checked) {
    checkedServices.push({
      name: 'Physiotherapy / Movement Rehab',
      details: `${s.physiotherapy.sessionsPerWeek || '—'} sessions/wk · Focus: ${s.physiotherapy.focusArea || '—'}`,
    });
  }
  if (s.cardiovascular.checked) {
    checkedServices.push({
      name: 'Cardiovascular Conditioning',
      details: `${s.cardiovascular.sessionsPerWeek || '—'} sessions/wk · Max HR: ${s.cardiovascular.maxHR || '—'} bpm`,
    });
  }
  if (s.mentalWellness.checked) {
    checkedServices.push({
      name: 'Mental Wellness Sessions',
      details: `${s.mentalWellness.sessionsPerWeek || '—'} sessions/wk · PHQ-2: ${s.mentalWellness.phq2 || '—'} · GAD-2: ${s.mentalWellness.gad2 || '—'}`,
    });
  }
  if (s.nutritionProgramme.checked) {
    checkedServices.push({
      name: 'Nutrition Programme Direction',
      details: `Approach: ${s.nutritionProgramme.approach || '—'} · Protein: ${s.nutritionProgramme.protein || '—'} g/kg · Caloric: ${s.nutritionProgramme.caloric || '—'}`,
    });
  }

  return (
    <div className="preview-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="preview-content" id="preview-print-area">
        <button className="preview-close" onClick={onClose} title="Close preview">✕</button>

        {/* ══════════ HEADER ══════════ */}
        <div className="preview-header">
          <h1>HB+ Wellness Prescription</h1>
          <p>HaSel Health and Wellness Pvt Ltd · info@hbplus.fit · +91 7848094954</p>
        </div>

        {/* ══════════ PRESCRIBING PHYSICIAN ══════════ */}
        <div className="pv-card">
          <p className="pv-card-title">Prescribing Physician</p>
          <div className="pv-row">
            <div className="pv-field pv-field--half">
              <span className="lbl">Name:</span>
              <span className="val">{physician?.name || '—'}</span>
            </div>
            <div className="pv-field pv-field--half">
              <span className="lbl">Reg #:</span>
              <span className="val">{physician?.regNumber || '—'}</span>
            </div>
          </div>
          <div className="pv-row">
            <div className="pv-field pv-field--half">
              <span className="lbl">Specialisation:</span>
              <span className="val">{physician?.specialisation || '—'}</span>
            </div>
            <div className="pv-field pv-field--half">
              <span className="lbl">Date:</span>
              <span className="val">{formData.date || '—'}</span>
            </div>
          </div>
        </div>

        {/* ══════════ CLIENT DETAILS ══════════ */}
        <div className="pv-card">
          <p className="pv-card-title">Client Details</p>
          <div className="pv-row">
            <div className="pv-field pv-field--half">
              <span className="lbl">Name:</span>
              <span className="val">{formData.clientName || '—'}</span>
            </div>
            <div className="pv-field pv-field--half">
              <span className="lbl">Age / Gender:</span>
              <span className="val">{formData.age || '—'} / {formData.gender || '—'}</span>
            </div>
          </div>
        </div>

        {/* ══════════ CHIEF COMPLAINT ══════════ */}
        {formData.chiefComplaints.some(c => c.trim()) && (
          <div className="pv-card">
            <p className="pv-card-title">Chief Complaint</p>
            <ol className="pv-list">
              {formData.chiefComplaints.filter(c => c.trim()).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ol>
          </div>
        )}

        {/* ══════════ ANY CONDITIONS ══════════ */}
        <div className="pv-card">
          <p className="pv-card-title">Any conditions</p>
          <div className="pv-field">
            <span className="val">{formData.AnyCondition || '—'}</span>
          </div>
          {formData.AnyConditionNotes && (
            <div className="pv-field" style={{ marginTop: '4px' }}>
              <span className="val" style={{ fontSize: '12px', color: '#666' }}>{formData.AnyConditionNotes}</span>
            </div>
          )}
        </div>

        {/* ══════════ KEY BLOOD FLAGS ══════════ */}
        <div className="pv-card">
          <p className="pv-card-title">Key Blood Flags (with values)</p>
          <div className="pv-field">
            <span className="val" style={{ whiteSpace: 'pre-wrap' }}>{formData.keyBloodFlags || '—'}</span>
          </div>
        </div>

        {/* ══════════ MEDICATIONS ══════════ */}
        <div className="pv-card">
          <p className="pv-card-title">Medications Currently On</p>
          {formData.medicationsCurrentlyOn.some(m => m.trim()) ? (
            <ol className="pv-list">
              {formData.medicationsCurrentlyOn.filter(m => m.trim()).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
          ) : (
            <div className="pv-field">
              <span className="val">—</span>
            </div>
          )}
        </div>

        {/* ══════════ SERVICES ══════════ */}
        {checkedServices.length > 0 && (
          <div className="pv-card">
            <p className="pv-card-title">HB+ Services Prescribed</p>
            <table className="pv-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {checkedServices.map((svc, i) => (
                  <tr key={i}>
                    <td>{svc.name}</td>
                    <td>{svc.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════ CONTRAINDICATIONS (dark card) ══════════ */}
        {formData.trainingContraindications && (
          <div className="pv-card pv-card--dark">
            <p className="pv-card-title">Training Contraindications / Red Flags to Coach</p>
            <div className="pv-field">
              <span className="val" style={{ whiteSpace: 'pre-wrap' }}>{formData.trainingContraindications}</span>
            </div>
          </div>
        )}

        {/* ══════════ 30-DAY TARGETS ══════════ */}
        <p className="pv-targets-title">30-Day Measurable Targets</p>
        <div className="pv-targets">
          <div className="pv-target-col">
            <div className="lbl">Target 1</div>
            <div className="val">{formData.target1 || '—'}</div>
          </div>
          <div className="pv-target-col">
            <div className="lbl">Target 2</div>
            <div className="val">{formData.target2 || '—'}</div>
          </div>
          <div className="pv-target-col">
            <div className="lbl">Target 3</div>
            <div className="val">{formData.target3 || '—'}</div>
          </div>
        </div>

        {/* ══════════ RED FLAGS ══════════ */}
        {formData.redFlags && (
          <div className="pv-card">
            <p className="pv-card-title">Red Flags — Contact GP / HB+ Team Immediately If</p>
            <div className="pv-field">
              <span className="val" style={{ whiteSpace: 'pre-wrap' }}>{formData.redFlags}</span>
            </div>
          </div>
        )}

        {/* ══════════ AUTHORIZATION ══════════ */}
        <div className="pv-auth">
          <div className="pv-auth-col">
            <span className="lbl">Physician Signature</span>
            {physician?.signature ? (
              <img src={physician.signature} alt="Signature" className="pv-sig-img" />
            ) : (
              <span className="val">—</span>
            )}
          </div>
          <div className="pv-auth-col">
            <span className="lbl">Date</span>
            <span className="val">{formData.date || '—'}</span>
          </div>
          <div className="pv-auth-col">
            <span className="lbl">Client Acknowledgement</span>
            <div className="pv-ack-line">
              <span className="val">{formData.clientAcknowledgement || ''}</span>
            </div>
          </div>
        </div>

        {/* ══════════ DISCLAIMER ══════════ */}
        <p className="pv-disclaimer">
          This prescription is issued as part of the HB+ wellness programme. It is a lifestyle medicine
          recommendation and does not replace conventional medical treatment. For emergencies, contact a
          qualified physician or emergency services.
        </p>

        {/* ══════════ HB+ LOGO — BOTTOM RIGHT ══════════ */}
        <div className="pv-logo-footer">
          <div className="pv-logo-block">
            <svg viewBox="0 0 140 60" width="100" height="42" xmlns="http://www.w3.org/2000/svg">
              {/* H */}
              <rect x="5" y="3" width="8" height="54" fill="#1a1a1a"/>
              <rect x="5" y="26" width="32" height="8" fill="#1a1a1a"/>
              <rect x="30" y="3" width="8" height="54" fill="#1a1a1a"/>
              {/* B top */}
              <rect x="30" y="3" width="40" height="8" fill="#1a1a1a"/>
              <rect x="30" y="26" width="40" height="8" fill="#1a1a1a"/>
              <rect x="30" y="49" width="40" height="8" fill="#1a1a1a"/>
              <rect x="65" y="3" width="8" height="54" fill="#1a1a1a"/>
              {/* + */}
              <rect x="86" y="16" width="5" height="24" fill="#b94a2c"/>
              <rect x="76" y="25" width="24" height="5" fill="#b94a2c"/>
            </svg>
            <span className="pv-logo-text">HB+ Prescription</span>
          </div>
        </div>

        {/* ══════════ ACTIONS ══════════ */}
        <div className="preview-actions">
          <button className="btn-outline" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={onGeneratePDF}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
