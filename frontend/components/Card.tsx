// Simple Card component
// A container for displaying information in a styled box

import React from 'react';

// Define the props for the Card component
type CardProps = {
    children: React.ReactNode; // The content inside the card
    title?: string; // Optional title for the card
    className?: string; // Additional CSS classes
    onClick?: () => void; // Optional click handler
};

export default function Card({ children, title, className = '', onClick }: CardProps) {
    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 ${className}`}
            onClick={onClick}
        >
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            {children}
        </div>
    );
}
