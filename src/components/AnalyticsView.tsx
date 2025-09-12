import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate } from 'react-router-dom';
import {
    $cards,
    $totalScans,
    cardsActions
} from '../stores/cardsStore';
import {
    $contacts,
    contactsActions
} from '../stores/contactsStore';
import {
    $isPremium
} from '../stores/authStore';
import Loading from './ui/Loading';

// Import the new analytics components
import AnalyticsHeader from './analytics/AnalyticsHeader';
import AnalyticsStatsCards from './analytics/AnalyticsStatsCards';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import AnalyticsInsights from './analytics/AnalyticsInsights';
import AnalyticsCardPerformance from './analytics/AnalyticsCardPerformance';

// Types for analytics data
interface ScansByDate {
    date: string;
    scans: number;
}

interface DeviceType {
    type: string;
    count: number;
    percentage: number;
}

interface Location {
    city: string;
    country: string;
    count: number;
}

interface AnalyticsData {
    totalScans: number;
    weeklyScans: number;
    monthlyScans: number;
    dailyScans: number;
    totalContacts: number;
    contactsThisWeek: number;
    averageScansPerCard: number;
    conversionRate: number;
    topDevice: string;
    topLocation: { city: string; country: string; count: number };
    peakHour: number;
    scansByDate: ScansByDate[];
    deviceTypes: DeviceType[];
    topLocations: Location[];
}

interface CardPerformanceData {
    id: number;
    name: string;
    title?: string;
    totalScans: number;
    monthlyScans: number;
    weeklyScans: number;
    contactsGenerated: number;
    conversionRate: number;
    lastScanned?: string;
    isActive: boolean;
}

// Utility function to generate mock analytics data based on real data
const generateAnalyticsData = (
    cards: any[],
    contacts: any[],
    totalScans: number,
    timeRange: string
): AnalyticsData => {
    // Calculate time-based scans
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Mock calculations based on real data patterns
    const weeklyScans = Math.floor(totalScans * 0.2); // Assume 20% of scans are from this week
    const monthlyScans = Math.floor(totalScans * 0.6); // 60% from this month
    const dailyScans = totalScans / Math.max(cards.length * 30, 1); // Average daily

    const recentContacts = contacts.filter(c =>
        new Date(c.scannedAt || c.created_at) > weekAgo
    ).length;

    const conversionRate = totalScans > 0 ? (contacts.length / totalScans) * 100 : 0;
    const averageScansPerCard = cards.length > 0 ? totalScans / cards.length : 0;

    // Generate date series for charts
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const scansByDate: ScansByDate[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dailyScansForDate = Math.floor(Math.random() * (dailyScans * 2)); // Some variation
        scansByDate.push({
            date: date.toISOString().split('T')[0],
            scans: dailyScansForDate
        });
    }

    // Mock device types (realistic distribution)
    const deviceTypes: DeviceType[] = [
        { type: 'Mobile', count: Math.floor(totalScans * 0.7), percentage: 70 },
        { type: 'Desktop', count: Math.floor(totalScans * 0.2), percentage: 20 },
        { type: 'Tablet', count: Math.floor(totalScans * 0.1), percentage: 10 }
    ];

    // Mock locations (you could enhance this with real IP geolocation data)
    const topLocations: Location[] = [
        { city: 'San Francisco', country: 'USA', count: Math.floor(totalScans * 0.3) },
        { city: 'New York', country: 'USA', count: Math.floor(totalScans * 0.2) },
        { city: 'London', country: 'UK', count: Math.floor(totalScans * 0.15) },
        { city: 'Toronto', country: 'Canada', count: Math.floor(totalScans * 0.1) },
        { city: 'Sydney', country: 'Australia', count: Math.floor(totalScans * 0.08) }
    ].filter(location => location.count > 0);

    return {
        totalScans,
        weeklyScans,
        monthlyScans,
        dailyScans,
        totalContacts: contacts.length,
        contactsThisWeek: recentContacts,
        averageScansPerCard,
        conversionRate,
        topDevice: 'Mobile',
        topLocation: topLocations[0] || { city: 'Unknown', country: 'Unknown', count: 0 },
        peakHour: 14, // 2 PM - typical business networking time
        scansByDate,
        deviceTypes,
        topLocations
    };
};

// Generate card performance data
const generateCardPerformanceData = (cards: any[], contacts: any[]): CardPerformanceData[] => {
    return cards.map(card => {
        const cardContacts = contacts.filter(c => c.cardId === card.id).length;
        const monthlyScans = Math.floor((card.scanCount || 0) * 0.6);
        const weeklyScans = Math.floor((card.scanCount || 0) * 0.2);
        const conversionRate = card.scanCount > 0 ? (cardContacts / card.scanCount) * 100 : 0;

        return {
            id: card.id,
            name: `${card.firstName || ''} ${card.lastName || ''}`.trim() || 'Unnamed Card',
            title: card.title,
            totalScans: card.scanCount || 0,
            monthlyScans,
            weeklyScans,
            contactsGenerated: cardContacts,
            conversionRate,
            lastScanned: card.updated_at,
            isActive: card.is_active !== false
        };
    });
};

const AnalyticsView: React.FC = () => {
    const cards = useStore($cards);
    const totalScans = useStore($totalScans);
    const contacts = useStore($contacts);
    const isPremium = useStore($isPremium);
    const navigate = useNavigate();

    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [cardPerformanceData, setCardPerformanceData] = useState<CardPerformanceData[]>([]);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Ensure we have fresh data
                await Promise.all([
                    cardsActions.fetchCards(),
                    contactsActions.fetchContacts()
                ]);

                // Simulate API delay for smooth loading experience
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error loading analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Generate analytics data when base data changes
    useEffect(() => {
        if (cards.length > 0 || contacts.length > 0 || totalScans > 0) {
            const data = generateAnalyticsData(cards, contacts, totalScans, timeRange);
            const performanceData = generateCardPerformanceData(cards, contacts);

            setAnalyticsData(data);
            setCardPerformanceData(performanceData);
        }
    }, [cards, contacts, totalScans, timeRange]);

    const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
        setTimeRange(range);
        // Re-generate data for new time range
        if (cards.length > 0 || contacts.length > 0 || totalScans > 0) {
            const data = generateAnalyticsData(cards, contacts, totalScans, range);
            setAnalyticsData(data);
        }
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting analytics data...');
        // You could generate CSV/PDF reports here
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await Promise.all([
                cardsActions.fetchCards(),
                contactsActions.fetchContacts()
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCard = (cardId: number) => {
        window.open(`/card/${cardId}`, '_blank');
    };

    const handleEditCard = (cardId: number) => {
        navigate(`/cards/edit/${cardId}`);
    };

    // Show upgrade prompt for non-premium users
    if (!isPremium) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="h-16 w-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Analytics</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Unlock detailed analytics and insights to track your networking success and optimize your digital presence.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        <div className="text-center p-6 bg-white rounded-lg border">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Detailed Tracking</h3>
                            <p className="text-sm text-gray-600">See exactly when, where, and how people interact with your cards</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg border">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Smart Insights</h3>
                            <p className="text-sm text-gray-600">Get AI-powered recommendations to improve your networking performance</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg border">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Export Reports</h3>
                            <p className="text-sm text-gray-600">Download detailed reports for presentations and record keeping</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/upgrade')}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade to Premium
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading && !analyticsData) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Loading centered text="Loading analytics..." />
            </div>
        );
    }

    // Default analytics data if no real data exists
    const defaultAnalyticsData: AnalyticsData = {
        totalScans: 0,
        weeklyScans: 0,
        monthlyScans: 0,
        dailyScans: 0,
        totalContacts: 0,
        contactsThisWeek: 0,
        averageScansPerCard: 0,
        conversionRate: 0,
        topDevice: 'Mobile',
        topLocation: { city: 'Unknown', country: 'Unknown', count: 0 },
        peakHour: 14,
        scansByDate: [],
        deviceTypes: [],
        topLocations: []
    };

    const displayData = analyticsData || defaultAnalyticsData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <AnalyticsHeader
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                onExport={handleExport}
                onRefresh={handleRefresh}
                isLoading={loading}
                totalScans={totalScans}
            />

            {/* Stats Cards */}
            <AnalyticsStatsCards
                data={displayData}
                loading={loading}
            />

            {/* Charts */}
            <AnalyticsCharts
                scansByDate={displayData.scansByDate}
                deviceTypes={displayData.deviceTypes}
                topLocations={displayData.topLocations}
                timeRange={timeRange}
                loading={loading}
            />

            {/* Insights */}
            <AnalyticsInsights
                data={displayData}
                loading={loading}
            />

            {/* Card Performance */}
            {cards.length > 0 && (
                <AnalyticsCardPerformance
                    cards={cards}
                    performanceData={cardPerformanceData}
                    loading={loading}
                    onViewCard={handleViewCard}
                    onEditCard={handleEditCard}
                />
            )}

            {/* Empty State for New Users */}
            {totalScans === 0 && cards.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track Your Success?</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your first digital card and start building meaningful connections.
                        Analytics will appear here as people interact with your cards.
                    </p>
                    <button
                        onClick={() => navigate('/cards/create')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Create Your First Card
                    </button>
                </div>
            )}
        </div>
    );
};

export default AnalyticsView;