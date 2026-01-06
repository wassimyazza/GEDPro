// Simple Input component
// A reusable input field for forms

import React from 'react';

// Define the props for the Input component
type InputProps = {
    label?: string; // Optional label text
    type?: string; // Input type (text, email, password, etc.)
    value: string; // Current value of the input
    onChange: (value: string) => void; // Function to call when value changes
    placeholder?: string; // Placeholder text
    required?: boolean; // Whether the field is required
    disabled?: boolean; // Whether the input is disabled
    className?: string; // Additional CSS classes
};

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    className = '',
}: InputProps) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
        </div>
    );
}
