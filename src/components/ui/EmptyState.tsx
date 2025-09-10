import React from 'react';
import { QrCode, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
    icon?: LucideIcon;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   title,
                                                   description,
                                                   buttonText,
                                                   onClick,
                                                   icon: Icon = QrCode,
                                                   className = ""
                                               }) => (
    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center ${className}`}>
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        {buttonText && onClick && (
            <button
                onClick={onClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                {buttonText}
            </button>
        )}
    </div>
);

export default EmptyState;