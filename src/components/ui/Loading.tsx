import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    centered?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
                                             size = 'md',
                                             text = 'Loading...',
                                             centered = false
                                         }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const containerClasses = centered
        ? 'flex flex-col items-center justify-center min-h-[200px]'
        : 'flex items-center space-x-3';

    return (
        <div className={containerClasses}>
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
            {text && (
                <p className={`text-gray-600 ${textSizeClasses[size]} ${centered ? 'mt-3' : ''}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;