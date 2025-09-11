import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { QrCode, Users, BarChart3, Plus, Share2, CreditCard } from 'lucide-react';
import { $cards, $totalScans } from '../stores/cardsStore';
import StatCard from './ui/StatCard';
import QuickAction from './ui/QuickAction';
import ActivityItem from './ui/ActivityItem';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const cards = useStore($cards);
    const totalScans = useStore($totalScans);

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
            value: totalScans.toString()
        },
        {
            icon: BarChart3,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            label: 'This Week',
            value: Math.floor(totalScans * 0.3).toString() // Mock weekly scans
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
            onClick: () => navigate('/cards/create')
        },
        {
            icon: Share2,
            bgColor: 'bg-gray-50',
            hoverColor: 'hover:bg-gray-100',
            iconColor: 'text-gray-600',
            textColor: 'text-gray-700',
            label: 'Share Your Card',
            onClick: () => navigate('/cards')
        },
        {
            icon: CreditCard,
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
            iconColor: 'text-green-600',
            textColor: 'text-green-900',
            label: 'View Analytics',
            onClick: () => navigate('/analytics')
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
        <div>
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

            {/* Cards Overview */}
            {cards.length > 0 && (
                <div className="mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Your Cards</h3>
                            <button
                                onClick={() => navigate('/cards')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cards.slice(0, 3).map((card) => (
                                <div
                                    key={card.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/cards/edit/${card.id}`)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {card.photo ? (
                                            <img
                                                src={card.photo}
                                                alt={`${card.firstName || ''} ${card.lastName || ''}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-500 font-medium text-sm">
                                                    {card.firstName[0]}{card.lastName[0]}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {card.firstName} {card.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {card.title || 'No title'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {card.scanCount || 0} scans
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {cards.length === 0 && (
                <div className="mt-8">
                    <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <QrCode className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cards Yet</h3>
                        <p className="text-gray-600 mb-4">
                            Create your first digital business card to get started.
                        </p>
                        <button
                            onClick={() => navigate('/cards/create')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Card
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;