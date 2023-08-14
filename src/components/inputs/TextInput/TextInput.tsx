import React, { ChangeEventHandler, useState } from "react";

interface TextInputProps {
  label: string;
  type: "text" | "password" | "email";
  value: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: ChangeEventHandler<HTMLInputElement>;
  error: string | null;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  const { label, type, value, placeholder, onChange, onBlur, onFocus, error } =
    props;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  return (
    <div
      className={`input-group ${error ? "input-error" : ""} ${
        isFocused ? "input-focus" : ""
      }`}
    >
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-label={label}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default TextInput;
