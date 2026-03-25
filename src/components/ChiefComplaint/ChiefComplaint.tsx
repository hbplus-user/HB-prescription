// ============================================================
// ChiefComplaint Component
// Renders a numbered, dynamic list of complaint entries.
// - Pressing Enter adds a new numbered entry below and focuses it.
// - Each row has a ✕ button to delete that entry.
// - Pressing Backspace on an empty field also removes that entry.
// Props:
//   - complaints: string array from parent form state
//   - onChange: updates the entire complaints array in parent
// ============================================================

import React, { useRef } from 'react';
import './ChiefComplaint.css';

interface ChiefComplaintProps {
  /** Array of complaint strings (one per line entry) */
  complaints: string[];
  /** Called whenever the complaints array changes */
  onChange: (complaints: string[]) => void;
}

const ChiefComplaint: React.FC<ChiefComplaintProps> = ({ complaints, onChange }) => {
  // Keep refs to each input so we can focus the right one after add/remove
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * handleKeyDown — intercepts Enter and Backspace:
   *   Enter  → appends a new empty complaint entry and focuses it
   *   Backspace on empty field → removes that entry and focuses previous
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Insert a new empty string after the current index
      const updated = [...complaints];
      updated.splice(index + 1, 0, '');
      onChange(updated);
      // Focus the new input after state updates (next render tick)
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }

    if (e.key === 'Backspace' && complaints[index] === '' && complaints.length > 1) {
      e.preventDefault();
      // Remove the empty entry and focus the one above it
      const updated = complaints.filter((_, i) => i !== index);
      onChange(updated);
      setTimeout(() => inputRefs.current[Math.max(0, index - 1)]?.focus(), 0);
    }
  };

  /**
   * handleChange — updates a single complaint string at a given index
   */
  const handleChange = (value: string, index: number) => {
    const updated = [...complaints];
    updated[index] = value;
    onChange(updated);
  };

  /**
   * handleDelete — removes the entry at the given index.
   * Always keeps at least one row.
   */
  const handleDelete = (index: number) => {
    if (complaints.length === 1) {
      // Clear instead of remove when it's the last row
      onChange(['']);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
      return;
    }
    const updated = complaints.filter((_, i) => i !== index);
    onChange(updated);
    // Focus the row above (or row 0 if we deleted the first row)
    setTimeout(() => inputRefs.current[Math.max(0, index - 1)]?.focus(), 0);
  };

  return (
    <div className="chief-complaint">
      <div className="chief-complaint__list">
        {complaints.map((complaint, idx) => (
          <div key={idx} className="chief-complaint__row">
            {/* Numbered label */}
            <span className="chief-complaint__number">{idx + 1}.</span>

            {/* Input field for this complaint */}
            <input
              type="text"
              className="chief-complaint__input"
              value={complaint}
              placeholder="Type complaint and press Enter to add more..."
              ref={(el) => { inputRefs.current[idx] = el; }}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            />

            {/* ✕ Delete button — always visible */}
            <button
              type="button"
              className="chief-complaint__delete"
              title="Remove this entry"
              onClick={() => handleDelete(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Hint text showing keyboard shortcuts */}
      <p className="chief-complaint__hint">
        Press <kbd>Enter</kbd> to add · <kbd>Backspace</kbd> on empty to remove · click <kbd>✕</kbd> to delete
      </p>
    </div>
  );
};

export default ChiefComplaint;
