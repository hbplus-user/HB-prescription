import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

interface MultiSelectProps {
  label?: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="multi-select" ref={containerRef}>
      <div 
        className={`multi-select__display ${isOpen ? 'multi-select__display--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="multi-select__values">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => (
              <span key={val} className="multi-select__tag">
                {val}
                <button 
                  type="button"
                  className="multi-select__tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(val);
                  }}
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="multi-select__placeholder">{placeholder}</span>
          )}
        </div>
        <div className="multi-select__arrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="multi-select__dropdown">
          {options.map((option) => (
            <div 
              key={option} 
              className={`multi-select__option ${selectedValues.includes(option) ? 'multi-select__option--selected' : ''}`}
              onClick={() => toggleOption(option)}
            >
              <div className="multi-select__checkbox">
                {selectedValues.includes(option) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
