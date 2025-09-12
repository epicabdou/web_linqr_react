import React from 'react';
import {
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Target,
    Clock,
    Users,
    Zap,
    AlertCircle
} from 'lucide-react';

interface AnalyticsData {
    totalScans: number;
    weeklyScans: number;
    monthlyScans: number;
    totalContacts: number;
    contactsThisWeek: number;
    conversionRate: number;
    averageScansPerCard: number;
    topDevice: string;
    topLocation: { city: string; country: string; count: number };
    peakHour: number;
    scansByDate: Array<{ date: string; scans: number }>;
}

interface Insight {
    id: string;
    type: 'positive' | 'negative' | 'neutral' | 'tip';
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    action?: string;
}

interface AnalyticsInsightsProps {
    data: AnalyticsData;
    loading?: boolean;
}

const generateInsights = (data: AnalyticsData): Insight[] => {
    const insights: Insight[] = [];

    // Conversion rate insights
    if (data.conversionRate > 20) {
        insights.push({
            id: 'conversion-high',
            type: 'positive',
            icon: Target,
            title: 'Excellent Conversion Rate!',
            description: `You're converting ${data.conversionRate.toFixed(1)}% of scans into contacts, which is above average.`,
        });
    } else if (data.conversionRate < 5 && data.totalScans > 10) {
        insights.push({
            id: 'conversion-low',
            type: 'negative',
            icon: AlertCircle,
            title: 'Low Conversion Rate',
            description: `Only ${data.conversionRate.toFixed(1)}% of scans become contacts. Consider optimizing your card content.`,
            action: 'Add a clear call-to-action or compelling bio'
        });
    }

    // Growth trends
    const recentGrowth = data.weeklyScans;
    const previousWeekEstimate = Math.max(data.monthlyScans - data.weeklyScans, 0) / 3;

    if (recentGrowth > previousWeekEstimate * 1.2 && recentGrowth > 5) {
        insights.push({
            id: 'growth-positive',
            type: 'positive',
            icon: TrendingUp,
            title: 'Growing Engagement!',
            description: `Your scans increased by ${Math.round(((recentGrowth - previousWeekEstimate) / Math.max(previousWeekEstimate, 1)) * 100)}% this week.`,
        });
    } else if (recentGrowth < previousWeekEstimate * 0.8 && data.totalScans > 20) {
        insights.push({
            id: 'growth-negative',
            type: 'negative',
            icon: TrendingDown,
            title: 'Engagement Declining',
            description: `Scans dropped by ${Math.round(((previousWeekEstimate - recentGrowth) / Math.max(previousWeekEstimate, 1)) * 100)}% this week.`,
            action: 'Consider sharing your card more actively or updating your content'
        });
    }

    // Peak activity insights
    const peakTimeDisplay = data.peakHour === 0 ? '12 AM' :
        data.peakHour === 12 ? '12 PM' :
            data.peakHour < 12 ? `${data.peakHour} AM` : `${data.peakHour - 12} PM`;

    if (data.peakHour >= 9 && data.peakHour <= 17) {
        insights.push({
            id: 'timing-business',
            type: 'tip',
            icon: Clock,
            title: 'Business Hours Peak',
            description: `Most scans happen around ${peakTimeDisplay}, during business hours.`,
            action: 'Share your card during networking events or business meetings'
        });
    } else {
        insights.push({
            id: 'timing-off-hours',
            type: 'neutral',
            icon: Clock,
            title: 'Off-Hours Activity',
            description: `Peak activity is around ${peakTimeDisplay}. Your audience may be in different time zones.`,
        });
    }

    // Location insights
    if (data.topLocation && data.topLocation.count > data.totalScans * 0.4) {
        insights.push({
            id: 'location-concentrated',
            type: 'neutral',
            icon: Users,
            title: 'Geographic Focus',
            description: `${Math.round((data.topLocation.count / data.totalScans) * 100)}% of your scans come from ${data.topLocation.city}, ${data.topLocation.country}.`,
            action: 'Consider expanding to other markets or focusing on this successful region'
        });
    }

    // Device insights
    if (data.topDevice === 'Mobile') {
        insights.push({
            id: 'mobile-optimized',
            type: 'positive',
            icon: Zap,
            title: 'Mobile-Friendly Success',
            description: 'Most of your audience uses mobile devices. Your QR code strategy is working!',
        });
    }

    // Activity level insights
    if (data.totalScans === 0) {
        insights.push({
            id: 'getting-started',
            type: 'tip',
            icon: Lightbulb,
            title: 'Ready to Get Started?',
            description: 'Share your digital card with QR codes or direct links to start tracking engagement.',
            action: 'Add your card link to email signatures or social media bios'
        });
    } else if (data.totalScans < 10) {
        insights.push({
            id: 'early-stage',
            type: 'tip',
            icon: Lightbulb,
            title: 'Building Momentum',
            description: 'You have a few scans! Keep sharing to build networking momentum.',
            action: 'Try adding your QR code to business cards or event materials'
        });
    }

    // Engagement consistency
    if (data.scansByDate.length >= 7) {
        const recentDays = data.scansByDate.slice(-7);
        const daysWithScans = recentDays.filter(day => day.scans > 0).length;

        if (daysWithScans >= 5) {
            insights.push({
                id: 'consistent-engagement',
                type: 'positive',
                icon: Zap,
                title: 'Consistent Engagement',
                description: `You've had activity on ${daysWithScans} out of 7 recent days. Great consistency!`,
            });
        }
    }

    // Return top 4-5 most relevant insights
    return insights.slice(0, 5);
};

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ data, loading = false }) => {
    const insights = generateInsights(data);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="animate-pulse">
                    <div className="flex items-center mb-4">
                        <div className="w-6 h-6 bg-blue-200 rounded mr-2"></div>
                        <div className="h-6 bg-blue-200 rounded w-32"></div>
                    </div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-4 bg-blue-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getInsightStyle = (type: string) => {
        switch (type) {
            case 'positive':
                return {
                    container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    titleColor: 'text-green-900',
                    textColor: 'text-green-800'
                };
            case 'negative':
                return {
                    container: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    titleColor: 'text-red-900',
                    textColor: 'text-red-800'
                };
            case 'tip':
                return {
                    container: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    titleColor: 'text-amber-900',
                    textColor: 'text-amber-800'
                };
            default:
                return {
                    container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    titleColor: 'text-blue-900',
                    textColor: 'text-blue-800'
                };
        }
    };

    if (insights.length === 0) {
        return (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 mb-8">
                <div className="flex items-center mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <Lightbulb className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Insights</h3>
                </div>
                <p className="text-gray-600">
                    Keep using your digital cards to unlock personalized insights and recommendations!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                Smart Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight) => {
                    const style = getInsightStyle(insight.type);
                    const Icon = insight.icon;

                    return (
                        <div
                            key={insight.id}
                            className={`border rounded-xl p-4 ${style.container}`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 ${style.iconBg} rounded-lg flex-shrink-0`}>
                                    <Icon className={`h-4 w-4 ${style.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold ${style.titleColor} mb-1`}>
                                        {insight.title}
                                    </h4>
                                    <p className={`text-sm ${style.textColor} mb-2`}>
                                        {insight.description}
                                    </p>
                                    {insight.action && (
                                        <p className={`text-xs ${style.textColor} opacity-80 italic`}>
                                            💡 {insight.action}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalyticsInsights;