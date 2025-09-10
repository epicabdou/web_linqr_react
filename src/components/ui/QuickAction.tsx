import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
    icon: LucideIcon;
    bgColor: string;
    hoverColor: string;
    iconColor: string;
    textColor: string;
    label: string;
    onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
                                                     icon: Icon,
                                                     bgColor,
                                                     hoverColor,
                                                     iconColor,
                                                     textColor,
                                                     label,
                                                     onClick
                                                 }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-3 text-left ${bgColor} ${hoverColor} rounded-lg transition-colors`}
    >
        <Icon className={`h-5 w-5 ${iconColor} mr-3`} />
        <span className={`font-medium ${textColor}`}>{label}</span>
    </button>
);

export default QuickAction;