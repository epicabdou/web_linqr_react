import React from 'react';

interface DashboardHeaderProps {
    title?: string;
    subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
                                                             title = "Dashboard",
                                                             subtitle = "Welcome back! Here's an overview of your digital business cards."
                                                         }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
    );
};

export default DashboardHeader;