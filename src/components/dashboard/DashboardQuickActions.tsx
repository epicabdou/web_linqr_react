import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, BarChart3, Users, Settings } from 'lucide-react';

const DashboardQuickActions: React.FC = () => {
    const quickActions = [
        {
            title: 'Manage Cards',
            description: 'View, edit, and organize your cards',
            icon: QrCode,
            path: '/cards',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            hoverBgColor: 'group-hover:bg-blue-200'
        },
        {
            title: 'Analytics',
            description: 'Track your networking success',
            icon: BarChart3,
            path: '/analytics',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            hoverBgColor: 'group-hover:bg-green-200'
        },
        {
            title: 'Contacts',
            description: 'Manage your network connections',
            icon: Users,
            path: '/contacts',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            hoverBgColor: 'group-hover:bg-purple-200'
        },
        {
            title: 'Settings',
            description: 'Customize your account preferences',
            icon: Settings,
            path: '/settings',
            bgColor: 'bg-gray-100',
            iconColor: 'text-gray-600',
            hoverBgColor: 'group-hover:bg-gray-200'
        }
    ];

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-center">
                                <div className={`p-3 ${action.bgColor} rounded-lg ${action.hoverBgColor} transition-colors`}>
                                    <IconComponent className={`h-6 w-6 ${action.iconColor}`} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                                    <p className="text-gray-600 text-sm">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardQuickActions;