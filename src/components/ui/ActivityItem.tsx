import React from 'react';

interface ActivityItemProps {
    color: string;
    text: string;
    timestamp?: string;
    icon?: React.ReactNode;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
                                                       color,
                                                       text,
                                                       timestamp,
                                                       icon
                                                   }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className={`w-2 h-2 ${color} rounded-full mr-3 flex-shrink-0`}></div>
        <div className="flex-1">
            <span className="text-sm text-gray-700">{text}</span>
            {timestamp && (
                <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
            )}
        </div>
        {icon && (
            <div className="ml-3 text-gray-400">
                {icon}
            </div>
        )}
    </div>
);

export default ActivityItem;