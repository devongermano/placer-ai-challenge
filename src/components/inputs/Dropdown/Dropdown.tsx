import React from "react";
import "./Dropdown.css";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  disabled?: boolean;
  loading?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  error,
  onChange,
  disabled,
  loading,
}) => {
  const placeholderSelected = options.length === 0 && !loading;

  return (
    <div className={`input-group ${error ? "input-error" : ""}`}>
      <label htmlFor={`dropdown-${label}`}>{label}</label>
      <div className={`select-wrapper ${loading ? "input-loading" : ""}`}>
        <select
          id={`dropdown-${label}`}
          aria-label={label}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={placeholderSelected ? "placeholder-selected" : ""}
        >
          <option value="" disabled hidden>
            {loading
              ? "Loading..."
              : options.length > 0
              ? `Select ${label}`
              : "N/A"}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
