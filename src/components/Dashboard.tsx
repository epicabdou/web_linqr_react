import React from 'react';
import { QrCode, Users, BarChart3, Plus, Share2, CreditCard } from 'lucide-react';
import StatCard from './ui/StatCard';
import QuickAction from './ui/QuickAction';
import ActivityItem from './ui/ActivityItem';
import { Card } from '../types';

interface DashboardProps {
    cards: Card[];
    setCurrentView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cards, setCurrentView }) => {
    const stats = [
        {
            icon: QrCode,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            label: 'Active Cards',
            value: cards.length.toString()
        },
        {
            icon: Users,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            label: 'Total Scans',
            value: '247'
        },
        {
            icon: BarChart3,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            label: 'This Week',
            value: '52'
        }
    ];

    const quickActions = [
        {
            icon: Plus,
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-900',
            label: 'Create New Card',
            onClick: () => setCurrentView('cards')
        },
        {
            icon: Share2,
            bgColor: 'bg-gray-50',
            hoverColor: 'hover:bg-gray-100',
            iconColor: 'text-gray-600',
            textColor: 'text-gray-700',
            label: 'Share Your Card',
            onClick: () => {}
        },
        {
            icon: CreditCard,
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
            iconColor: 'text-green-600',
            textColor: 'text-green-900',
            label: 'Order Physical Cards',
            onClick: () => {}
        }
    ];

    const recentActivity = [
        {
            color: 'bg-green-400',
            text: 'Card scanned by Alex Johnson'
        },
        {
            color: 'bg-blue-400',
            text: 'Profile updated'
        },
        {
            color: 'bg-purple-400',
            text: 'New contact added'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                <p className="mt-2 text-gray-600">Manage your digital business cards and connections</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <QuickAction key={index} {...action} />
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;