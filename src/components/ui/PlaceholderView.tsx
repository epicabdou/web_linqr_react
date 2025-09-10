import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
    title: string;
    icon: LucideIcon;
    description?: string;
    actionButton?: {
        text: string;
        onClick: () => void;
    };
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({
                                                             title,
                                                             icon: Icon,
                                                             description,
                                                             actionButton
                                                         }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {description || `${title} feature coming soon...`}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We're working hard to bring you this feature. Stay tuned for updates!
            </p>
            {actionButton && (
                <button
                    onClick={actionButton.onClick}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {actionButton.text}
                </button>
            )}
        </div>
    </div>
);

export default PlaceholderView;