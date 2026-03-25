// ============================================================
// AuthorizationSection Component
// Renders the bottom authorization panel:
//   - Physician Signature: auto-filled from selected physician
//   - Date: calendar picker
//   - Client Acknowledgement: a signature line (text input)
// ============================================================

import React from 'react';
import './AuthorizationSection.css';
import type { PrescriptionFormData } from '../../types/prescription';

interface AuthorizationSectionProps {
  /** Auto-filled signature image URL from the selected physician */
  physicianSignature?: string;
  date: string;
  clientAcknowledgement: string;
  onChange: (field: keyof PrescriptionFormData, value: string) => void;
}

const AuthorizationSection: React.FC<AuthorizationSectionProps> = ({
  physicianSignature,
  date,
  clientAcknowledgement,
  onChange,
}) => {
  return (
    <div className="authorization-section">
      <span className="field-label">Authorization</span>

      <div className="authorization-section__row">
        {/* ─── Physician Signature column ─── */}
        <div className="authorization-section__col">
          <p className="authorization-section__col-label">Physician Signature</p>
          <div className="authorization-section__sig-box">
            {physicianSignature ? (
              <img
                src={physicianSignature}
                alt="Physician signature"
                className="authorization-section__sig-img"
              />
            ) : (
              <span className="authorization-section__sig-placeholder">
                Select a physician to auto-fill signature
              </span>
            )}
          </div>
        </div>

        {/* ─── Date column ─── */}
        <div className="authorization-section__col">
          <p className="authorization-section__col-label">Date</p>
          <input
            type="date"
            className="authorization-section__date"
            value={date}
            onChange={(e) => onChange('date', e.target.value)}
          />
        </div>

        {/* ─── Client Acknowledgement column ─── */}
        <div className="authorization-section__col">
          <p className="authorization-section__col-label authorization-section__col-label--orange">
            Client Acknowledgement
          </p>
          <div className="authorization-section__signature-line">
            <input
              type="text"
              className="authorization-section__signature-input"
              value={clientAcknowledgement}
              onChange={(e) => onChange('clientAcknowledgement', e.target.value)}
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="authorization-section__disclaimer">
        This prescription is issued as part of the HB+ wellness programme. It is a lifestyle medicine
        recommendation and does not replace conventional medical treatment. For emergencies, contact a
        <a href="#"> qualified physician</a> or emergency services.
      </p>
    </div>
  );
};

export default AuthorizationSection;
