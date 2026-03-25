// ============================================================
// ServicesSection Component
// Renders the "HB+ Services Prescribed" section.
// Each service has a checkbox to enable it, a sessions/week input,
// and one or more service-specific inline inputs.
//
// IMPORTANT: The ServiceField component is defined OUTSIDE
// ServicesSection so React keeps a stable reference and does
// NOT destroy/recreate inputs on every keystroke (which would
// cause the input to lose focus after a single character).
// ============================================================

import React from 'react';
import './ServicesSection.css';
import type { PrescriptionFormData } from '../../types/prescription';

// ─── Stable Field component (defined outside ServicesSection) ────────────────
// This MUST live outside the parent component so React treats it as the same
// component across re-renders, preserving focus in the input element.
interface ServiceFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
}

const ServiceField: React.FC<ServiceFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  size = 'small',
}) => (
  <>
    {label && <label>{label}</label>}
    <input
      type="text"
      className={`service-row__${size}-input`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </>
);

// ─── Main ServicesSection ────────────────────────────────────────────────────

interface ServicesSectionProps {
  /** The entire services object from form state */
  services: PrescriptionFormData['services'];
  /** Callback to update a specific field within a service */
  onChange: (
    service: keyof PrescriptionFormData['services'],
    field: string,
    value: string | boolean
  ) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onChange }) => {
  return (
    <div className="services-section">

      {/* ── 1. Strength & Conditioning ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.strengthConditioning.checked}
          onChange={(e) => onChange('strengthConditioning', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Strength &amp; Conditioning</span>
        <div className="service-row__fields">
          <ServiceField
            label="Sessions/week:"
            value={services.strengthConditioning.sessionsPerWeek}
            onChange={(v) => onChange('strengthConditioning', 'sessionsPerWeek', v)}
          />
          <ServiceField
            label="Modifications:"
            value={services.strengthConditioning.extra1}
            onChange={(v) => onChange('strengthConditioning', 'extra1', v)}
            size="large"
          />
        </div>
      </div>

      {/* ── 2. Yoga & Mobility ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.yogaMobility.checked}
          onChange={(e) => onChange('yogaMobility', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Yoga &amp; Mobility</span>
        <div className="service-row__fields">
          <ServiceField
            label="Sessions/week:"
            value={services.yogaMobility.sessionsPerWeek}
            onChange={(v) => onChange('yogaMobility', 'sessionsPerWeek', v)}
          />
          <ServiceField
            label="Format:"
            value={services.yogaMobility.format}
            onChange={(v) => onChange('yogaMobility', 'format', v)}
            placeholder="Restorative"
            size="medium"
          />
        </div>
      </div>

      {/* ── 3. Physiotherapy / Movement Rehab ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.physiotherapy.checked}
          onChange={(e) => onChange('physiotherapy', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Physiotherapy / Movement Rehab</span>
        <div className="service-row__fields">
          <ServiceField
            label="Sessions/week:"
            value={services.physiotherapy.sessionsPerWeek}
            onChange={(v) => onChange('physiotherapy', 'sessionsPerWeek', v)}
          />
          <ServiceField
            label="Focus area:"
            value={services.physiotherapy.focusArea}
            onChange={(v) => onChange('physiotherapy', 'focusArea', v)}
            size="large"
          />
        </div>
      </div>

      {/* ── 4. Cardiovascular Conditioning ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.cardiovascular.checked}
          onChange={(e) => onChange('cardiovascular', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Cardiovascular Conditioning</span>
        <div className="service-row__fields">
          <ServiceField
            label="Sessions/week:"
            value={services.cardiovascular.sessionsPerWeek}
            onChange={(v) => onChange('cardiovascular', 'sessionsPerWeek', v)}
          />
          <ServiceField
            label="Max HR cap:"
            value={services.cardiovascular.maxHR}
            onChange={(v) => onChange('cardiovascular', 'maxHR', v)}
          />
          <span className="service-row__unit">bpm</span>
        </div>
      </div>

      {/* ── 5. Mental Wellness Sessions ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.mentalWellness.checked}
          onChange={(e) => onChange('mentalWellness', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Mental Wellness Sessions</span>
        <div className="service-row__fields">
          <ServiceField
            label="Sessions/week:"
            value={services.mentalWellness.sessionsPerWeek}
            onChange={(v) => onChange('mentalWellness', 'sessionsPerWeek', v)}
          />
          <ServiceField
            label="PHQ-2:"
            value={services.mentalWellness.phq2}
            onChange={(v) => onChange('mentalWellness', 'phq2', v)}
          />
          <ServiceField
            label="GAD-2:"
            value={services.mentalWellness.gad2}
            onChange={(v) => onChange('mentalWellness', 'gad2', v)}
          />
        </div>
      </div>

      {/* ── 6. Nutrition Programme Direction ── */}
      <div className="service-row">
        <input
          type="checkbox"
          className="service-row__checkbox"
          checked={services.nutritionProgramme.checked}
          onChange={(e) => onChange('nutritionProgramme', 'checked', e.target.checked)}
        />
        <span className="service-row__name">Nutrition Programme Direction</span>
        <div className="service-row__fields">
          <ServiceField
            label="Approach:"
            value={services.nutritionProgramme.approach}
            onChange={(v) => onChange('nutritionProgramme', 'approach', v)}
            size="medium"
          />
          <ServiceField
            label="Protein:"
            value={services.nutritionProgramme.protein}
            onChange={(v) => onChange('nutritionProgramme', 'protein', v)}
          />
          <span className="service-row__unit">g/kg</span>
          <ServiceField
            label="Caloric:"
            value={services.nutritionProgramme.caloric}
            onChange={(v) => onChange('nutritionProgramme', 'caloric', v)}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
