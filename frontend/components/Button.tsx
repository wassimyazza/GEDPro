// Simple Button component
// A reusable button with different variants for the UI

import React from 'react';

// Define the props for the Button component
type ButtonProps = {
    children: React.ReactNode; // The text or content inside the button
    onClick?: () => void; // Function to call when button is clicked
    type?: 'button' | 'submit' | 'reset'; // HTML button type
    variant?: 'primary' | 'secondary' | 'danger'; // Visual style
    disabled?: boolean; // Whether the button is disabled
    className?: string; // Additional CSS classes
};

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
}: ButtonProps) {
    // Define styles based on variant
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    let variantStyles = '';

    if (variant === 'primary') {
        variantStyles = 'bg-blue-600 text-white hover:bg-blue-700';
    } else if (variant === 'secondary') {
        variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    } else if (variant === 'danger') {
        variantStyles = 'bg-red-600 text-white hover:bg-red-700';
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </button>
    );
}
