// ============================================================
// PhysicianHeader Component
// Renders the collapsible dark-navy header at the top of the
// form. Layout is a single horizontal flex row:
//
//   [ 👤 PRESCRIBING PHYSICIAN ]  [ Full Name ▼ ] [ Reg # ] [ Specialisation ] [ Sig ] [ ▲ ]
//
// Selecting a physician auto-fills:
//   - Registration Number (read-only)
//   - Specialisation (read-only)
//   - Signature preview (inline SVG/image)
//
// Props:
//   - physicianId: currently selected physician id (from parent state)
//   - onChange: callback to update parent state for physicianId
// ============================================================

import React, { useState } from 'react';
import './PhysicianHeader.css';
import { PHYSICIANS } from '../../data/physicians';
import type { PrescriptionFormData } from '../../types/prescription';

interface PhysicianHeaderProps {
  /** Currently selected physician id (from form state) */
  physicianId: string;
  /** Generic field change handler passed from parent App component */
  onChange: (field: keyof PrescriptionFormData, value: string) => void;
}

const PhysicianHeader: React.FC<PhysicianHeaderProps> = ({ physicianId, onChange }) => {
  // Controls whether the three field columns are visible or hidden
  const [collapsed, setCollapsed] = useState(false);

  // Look up the selected physician to auto-fill the readonly fields
  const selected = PHYSICIANS.find((p) => p.id === physicianId);

  return (
    // Single flex row: title | [fields] | collapse-btn
    <div className="physician-header">

      {/* ── LEFT: icon + section label ── */}
      <div className="physician-header__title-row">
        {/* Person icon in golden-orange */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0c080" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="physician-header__title">Prescribing Physician</span>
      </div>

      {/* ── MIDDLE: field columns — hidden when collapsed ── */}
      {!collapsed && (
        <div className="physician-header__fields">

          {/* Full Name dropdown — changing this fills the other fields */}
          <div className="physician-header__field">
            <label htmlFor="physician-select">Full Name</label>
            <select
              id="physician-select"
              value={physicianId}
              onChange={(e) => onChange('physicianId', e.target.value)}
            >
              <option value="">Select physician</option>
              {PHYSICIANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Number — read-only, auto-filled */}
          <div className="physician-header__field">
            <label>Registration #</label>
            <input
              type="text"
              readOnly
              value={selected?.regNumber ?? ''}
              placeholder="Reg #"
            />
          </div>

          {/* Specialisation — read-only, auto-filled */}
          <div className="physician-header__field">
            <label>Specialisation</label>
            <input
              type="text"
              readOnly
              value={selected?.specialisation ?? ''}
              placeholder="Specialisation"
            />
          </div>

        </div>
      )}

      {/* ── RIGHT: collapse / expand toggle ── */}
      <button
        className="physician-header__collapse"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '▼' : '▲'}
      </button>
    </div>
  );
};

export default PhysicianHeader;
