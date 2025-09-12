// components/ui/Toggle.tsx - Reusable toggle component
import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'purple' | 'red';
}

const Toggle: React.FC<ToggleProps> = ({
                                           checked,
                                           onChange,
                                           disabled = false,
                                           size = 'md',
                                           color = 'blue'
                                       }) => {
    const sizeClasses = {
        sm: 'h-4 w-8',
        md: 'h-6 w-11',
        lg: 'h-8 w-14'
    };

    const thumbSizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-6 w-6'
    };

    const translateClasses = {
        sm: checked ? 'translate-x-4' : 'translate-x-0.5',
        md: checked ? 'translate-x-6' : 'translate-x-1',
        lg: checked ? 'translate-x-7' : 'translate-x-1'
    };

    const colorClasses = {
        blue: checked ? 'bg-blue-600' : 'bg-gray-200',
        green: checked ? 'bg-green-600' : 'bg-gray-200',
        purple: checked ? 'bg-purple-600' : 'bg-gray-200',
        red: checked ? 'bg-red-600' : 'bg-gray-200'
    };

    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${sizeClasses[size]} ${colorClasses[color]}`}
        >
            <span
                className={`inline-block transform rounded-full bg-white transition-transform ${thumbSizeClasses[size]} ${translateClasses[size]}`}
            />
        </button>
    );
};

export default Toggle;