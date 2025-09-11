import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import {
    BarChart3,
    TrendingUp,
    Users,
    MapPin,
    Clock,
    Smartphone,
    Calendar,
    Download
} from 'lucide-react';
import { $cards, $totalScans } from '../../stores/cardsStore';
import { $contactsCount } from '../../stores/contactsStore';
import { $isPremium } from '../../stores/authStore';
import StatCard from '../ui/StatCard';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import { Analytics } from '../../types';

const AnalyticsDashboard: React.FC = () => {
    const navigate = useNavigate();
    const cards = useStore($cards);
    const totalScans = useStore($totalScans);
    const contactsCount = useStore($contactsCount);
    const isPremium = useStore($isPremium);

    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    // Mock analytics data (replace with real API calls)
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data based on user's plan
            const mockAnalytics: Analytics = {
                totalScans: totalScans,
                weeklyScans: Math.floor(totalScans * 0.3),
                monthlyScans: Math.floor(totalScans * 0.8),
                topLocations: [
                    { city: 'San Francisco', country: 'USA', count: Math.floor(totalScans * 0.4) },
                    { city: 'New York', country: 'USA', count: Math.floor(totalScans * 0.25) },
                    { city: 'London', country: 'UK', count: Math.floor(totalScans * 0.15) },
                    { city: 'Toronto', country: 'Canada', count: Math.floor(totalScans * 0.1) },
                    { city: 'Sydney', country: 'Australia', count: Math.floor(totalScans * 0.1) }
                ],
                scansByDate: generateMockScansByDate(timeRange),
                deviceTypes: [
                    { type: 'Mobile', count: Math.floor(totalScans * 0.7) },
                    { type: 'Desktop', count: Math.floor(totalScans * 0.2) },
                    { type: 'Tablet', count: Math.floor(totalScans * 0.1) }
                ]
            };

            setAnalytics(mockAnalytics);
            setLoading(false);
        };

        fetchAnalytics();
    }, [totalScans, timeRange]);

    const generateMockScansByDate = (range: string) => {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 10) + 1
            });
        }

        return data;
    };

    if (!isPremium) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Analytics</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Upgrade to Premium to unlock detailed analytics and insights about your digital business cards.
                </p>
                <Button
                    onClick={() => navigate('/upgrade')}
                    size="lg"
                >
                    Upgrade to Premium
                </Button>
            </div>
        );
    }

    if (loading) {
        return <Loading centered text="Loading analytics..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="mt-2 text-gray-600">Track your networking success and engagement</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Time Range Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    timeRange === range
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {range === '7d' ? '7 days' : range === '30d' ? '30 days' : range === '90d' ? '90 days' : '1 year'}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        icon={Download}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={BarChart3}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                    label="Total Scans"
                    value={analytics?.totalScans.toString() || '0'}
                />
                <StatCard
                    icon={TrendingUp}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                    label="This Month"
                    value={analytics?.monthlyScans.toString() || '0'}
                />
                <StatCard
                    icon={Users}
                    bgColor="bg-purple-100"
                    iconColor="text-purple-600"
                    label="Contacts"
                    value={contactsCount.toString()}
                />
                <StatCard
                    icon={Clock}
                    bgColor="bg-orange-100"
                    iconColor="text-orange-600"
                    label="This Week"
                    value={analytics?.weeklyScans.toString() || '0'}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Scans Over Time Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Chart visualization would go here</p>
                            <p className="text-sm text-gray-400">Showing {timeRange} data</p>
                        </div>
                    </div>
                </div>

                {/* Device Types */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
                    <div className="space-y-4">
                        {analytics?.deviceTypes.map((device, index) => {
                            const percentage = analytics.totalScans > 0
                                ? Math.round((device.count / analytics.totalScans) * 100)
                                : 0;

                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Smartphone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-900">{device.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Geographic Distribution and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Locations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                    <div className="space-y-4">
                        {analytics?.topLocations.map((location, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">
                                        {location.city}, {location.country}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {location.count} scans
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Mock recent activity */}
                        {[
                            { action: 'Card scanned', location: 'San Francisco, CA', time: '2 hours ago' },
                            { action: 'New contact added', location: 'New York, NY', time: '5 hours ago' },
                            { action: 'Card scanned', location: 'London, UK', time: '1 day ago' },
                            { action: 'Profile updated', location: 'San Francisco, CA', time: '2 days ago' },
                            { action: 'Card scanned', location: 'Toronto, ON', time: '3 days ago' }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.location}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card Performance */}
            {cards.length > 1 && (
                <div className="mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Card
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Scans
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        This Month
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Conversion Rate
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {cards.map((card) => {
                                    const monthlyScans = Math.floor((card.scanCount || 0) * 0.3);
                                    const conversionRate = Math.floor(Math.random() * 25) + 10; // Mock conversion rate

                                    return (
                                        <tr key={card.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {card.firstName || ''} {card.lastName || ''}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{card.title || 'No title'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {card.scanCount || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {monthlyScans}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {conversionRate}%
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Insights */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Insights</h3>
                <div className="space-y-2 text-sm text-blue-800">
                    <p>• Your cards are most active during weekdays between 9 AM - 5 PM</p>
                    <p>• Mobile devices account for {analytics?.deviceTypes.find(d => d.type === 'Mobile')?.count || 70}% of your scans</p>
                    <p>• San Francisco is your top scanning location with {analytics?.topLocations[0]?.count || 0} scans</p>
                    {contactsCount > 0 && (
                        <p>• You've successfully converted {Math.round((contactsCount / totalScans) * 100)}% of scans into contacts</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;