// ============================================================
// PrescriptionHeader Component
// Shows the document-style "HB+ Wellness Prescription" banner:
//   - Left: Title + clinic info (static)
//   - Right: Date (calendar picker), Auto-generated Consultation #, Next visit
//
// Consultation number is auto-generated on mount as HB+001, HB+002…
// by reading a persisted counter from localStorage.
// The date field is a calendar picker (input[type=date]).
//
// Props:
//   - consultationNumber: the auto-generated value shown read-only
//   - onChange: updates parent state for consultationNumber
// ============================================================

import React, { useEffect } from 'react';
import './PrescriptionHeader.css';
import type { PrescriptionFormData } from '../../types/prescription';

interface PrescriptionHeaderProps {
  /** Current consultation number string (auto-generated) */
  consultationNumber: string;
  /** Current date string (from parent state) */
  date: string;
  /** Generic field change handler from parent */
  onChange: (field: keyof PrescriptionFormData, value: string) => void;
}

// ── Retrieve next consultation number via localStorage ──────────────────────
function getNextConsultationNumber(): string {
  const stored = localStorage.getItem('hbplus_consult_counter');
  const next = stored ? parseInt(stored, 10) + 1 : 1;
  return `HB+${String(next).padStart(3, '0')}`;
}

const PrescriptionHeader: React.FC<PrescriptionHeaderProps> = ({
  consultationNumber,
  date,
  onChange,
}) => {

  // Generate consultation number once on mount (only if not already set)
  useEffect(() => {
    if (!consultationNumber) {
      onChange('consultationNumber', getNextConsultationNumber());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="prescription-header">
      {/* LEFT: Brand title and clinic info */}
      <div className="prescription-header__left">
        <h1 className="prescription-header__title">HB+ Wellness Prescription</h1>
        <p className="prescription-header__subtitle">
          HaSel Health and Wellness Pvt Ltd · info@hbplus.fit · +91 7848094954
        </p>
      </div>

      {/* RIGHT: Date picker, Consultation #, Next visit */}
      <div className="prescription-header__right">
        {/* Calendar date picker */}
        <div className="prescription-header__meta-row">
          <span>Date:</span>
          <input
            type="date"
            className="prescription-header__date-input"
            value={date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>

        {/* Auto-generated consultation number — read-only */}
        <div className="prescription-header__meta-row">
          <span>Consultation #:</span>
          <strong className="prescription-header__consult-num">{consultationNumber}</strong>
        </div>

        {/* Static next visit label */}
        <div className="prescription-header__next">
          Next: <strong>30 days from date</strong>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
