import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    label: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({
                                               icon: Icon,
                                               bgColor,
                                               iconColor,
                                               label,
                                               value
                                           }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
            <div className={`p-2 ${bgColor} rounded-lg`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

export default StatCard;