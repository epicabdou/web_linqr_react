import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    label?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    className?: string;
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
                                         type = 'text',
                                         placeholder,
                                         value,
                                         onChange,
                                         onBlur,
                                         onFocus,
                                         disabled = false,
                                         required = false,
                                         error,
                                         label,
                                         icon: Icon,
                                         iconPosition = 'left',
                                         className = '',
                                         fullWidth = false,
                                         size = 'md'
                                     }) => {
    const baseClasses = 'block border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors';

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

    const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${widthClass}
    ${errorClass}
    ${disabledClass}
    ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `.trim();

    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    disabled={disabled}
                    required={required}
                    className={inputClasses}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;