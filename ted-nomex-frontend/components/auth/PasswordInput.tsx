"use client";

import { useState } from "react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  placeholder?: string;
};

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete = "current-password",
  required,
  minLength,
  disabled,
  placeholder,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        disabled={disabled}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        <span className="material-symbols-outlined">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}