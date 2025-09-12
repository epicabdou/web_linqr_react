import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Eye,
    MousePointer,
    Calendar,
    Target
} from 'lucide-react';

interface AnalyticsData {
    totalScans: number;
    weeklyScans: number;
    monthlyScans: number;
    dailyScans: number;
    totalContacts: number;
    contactsThisWeek: number;
    averageScansPerCard: number;
    conversionRate: number; // percentage of scans that became contacts
}

interface AnalyticsStatsCardsProps {
    data: AnalyticsData;
    loading?: boolean;
}

const StatCard: React.FC<{
    icon: React.ComponentType<any>;
    bgColor: string;
    iconColor: string;
    label: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}> = ({ icon: Icon, bgColor, iconColor, label, value, change, changeType = 'neutral' }) => {
    const changeColorClass = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-500'
    }[changeType];

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
                <div className={`p-3 ${bgColor} rounded-xl`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-xs ${changeColorClass} mt-1`}>{change}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const AnalyticsStatsCards: React.FC<AnalyticsStatsCardsProps> = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="animate-pulse">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                <div className="ml-4 flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            icon: Eye,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            label: 'Total Scans',
            value: data.totalScans.toLocaleString(),
            change: `+${data.weeklyScans} this week`,
            changeType: data.weeklyScans > 0 ? 'positive' as const : 'neutral' as const
        },
        {
            icon: TrendingUp,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            label: 'Monthly Scans',
            value: data.monthlyScans.toLocaleString(),
            change: data.monthlyScans > 0 ? `${Math.round(((data.monthlyScans - (data.totalScans - data.monthlyScans)) / Math.max(data.totalScans - data.monthlyScans, 1)) * 100)}% vs last month` : 'No data yet',
            changeType: data.monthlyScans > (data.totalScans - data.monthlyScans) ? 'positive' as const : 'negative' as const
        },
        {
            icon: Users,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            label: 'Total Contacts',
            value: data.totalContacts.toLocaleString(),
            change: `+${data.contactsThisWeek} this week`,
            changeType: data.contactsThisWeek > 0 ? 'positive' as const : 'neutral' as const
        },
        {
            icon: Clock,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            label: 'Weekly Scans',
            value: data.weeklyScans.toLocaleString(),
            change: 'Last 7 days',
            changeType: 'neutral' as const
        },
        {
            icon: Calendar,
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            label: 'Daily Average',
            value: Math.round(data.dailyScans).toLocaleString(),
            change: 'Avg per day',
            changeType: 'neutral' as const
        },
        {
            icon: BarChart3,
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            label: 'Per Card Average',
            value: data.averageScansPerCard.toFixed(1),
            change: 'Scans per card',
            changeType: 'neutral' as const
        },
        {
            icon: Target,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            label: 'Conversion Rate',
            value: `${data.conversionRate.toFixed(1)}%`,
            change: 'Scans to contacts',
            changeType: data.conversionRate > 15 ? 'positive' as const : data.conversionRate > 5 ? 'neutral' as const : 'negative' as const
        },
        {
            icon: MousePointer,
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            label: 'Today',
            value: Math.round(data.dailyScans).toLocaleString(),
            change: 'Scans today',
            changeType: 'neutral' as const
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default AnalyticsStatsCards;