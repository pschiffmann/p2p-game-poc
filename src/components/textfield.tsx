import React, { useCallback } from "react";

export interface TextfieldProps {
  readonly className?: string;
  readonly label: string;
  readonly value: string;
  onChange?(value: string): void;
}

export const Textfield: React.FC<TextfieldProps> = ({
  className,
  label,
  value,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.currentTarget.value);
    },
    [onChange]
  );
  return (
    <label className={`${className} textfield`}>
      <div className="textfield__label">{label}</div>
      <input
        className="textfield__input"
        type="text"
        value={value}
        readOnly={!onChange}
        onChange={handleChange}
      />
    </label>
  );
};
