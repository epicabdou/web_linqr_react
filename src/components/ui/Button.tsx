import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    className?: string;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           type = 'button',
                                           variant = 'primary',
                                           size = 'md',
                                           disabled = false,
                                           loading = false,
                                           icon: Icon,
                                           iconPosition = 'left',
                                           className = '',
                                           fullWidth = false,
                                       }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${disabledClasses}
    ${className}
  `.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
                Icon && iconPosition === 'left' && <Icon className="h-4 w-4 mr-2" />
            )}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="h-4 w-4 ml-2" />}
        </button>
    );
};

export default Button;