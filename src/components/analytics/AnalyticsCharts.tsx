import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Smartphone,
    Monitor,
    Tablet,
    MapPin,
    Clock
} from 'lucide-react';

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

interface AnalyticsChartsProps {
    scansByDate: ScansByDate[];
    deviceTypes: DeviceType[];
    topLocations: Location[];
    timeRange: '7d' | '30d' | '90d' | '1y';
    loading?: boolean;
}

const ScansOverTimeChart: React.FC<{
    data: ScansByDate[];
    timeRange: string;
    loading?: boolean;
}> = ({ data, timeRange, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
                    <div className="h-64 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        );
    }

    const maxScans = Math.max(...data.map(d => d.scans), 1);

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Scans Over Time</h3>
                <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {timeRange}
                </div>
            </div>

            <div className="h-64">
                {data.length > 0 ? (
                    <div className="h-full flex items-end justify-between space-x-1">
                        {data.map((item, index) => {
                            const height = (item.scans / maxScans) * 100;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors relative"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {item.scans} scans
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                                        {new Date(item.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No scan data available</p>
                            <p className="text-sm text-gray-400">Data will appear as you get scans</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DeviceTypesChart: React.FC<{ data: DeviceType[]; loading?: boolean }> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getDeviceIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            case 'desktop': return Monitor;
            default: return Monitor;
        }
    };

    const getDeviceColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mobile': return 'bg-green-500';
            case 'tablet': return 'bg-blue-500';
            case 'desktop': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Types</h3>

            {data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((device, index) => {
                        const Icon = getDeviceIcon(device.type);
                        const colorClass = getDeviceColor(device.type);

                        return (
                            <div key={index} className="flex items-center">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Icon className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900">{device.type}</span>
                                            <span className="text-sm text-gray-600">{device.count} ({device.percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${colorClass} h-2 rounded-full transition-all duration-300`}
                                                style={{ width: `${device.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No device data available</p>
                </div>
            )}
        </div>
    );
};

const TopLocationsChart: React.FC<{ data: Location[]; loading?: boolean }> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                <div className="w-12 h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(l => l.count), 1);

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Locations</h3>

            {data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((location, index) => {
                        const percentage = (location.count / maxCount) * 100;

                        return (
                            <div key={index} className="flex items-center">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-600">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {location.city}, {location.country}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600">{location.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No location data available</p>
                </div>
            )}
        </div>
    );
};

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
                                                             scansByDate,
                                                             deviceTypes,
                                                             topLocations,
                                                             timeRange,
                                                             loading = false
                                                         }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Scans Over Time - Full width on mobile, half width on lg+ */}
            <div className="lg:col-span-2">
                <ScansOverTimeChart data={scansByDate} timeRange={timeRange} loading={loading} />
            </div>

            {/* Device Types and Locations side by side */}
            <DeviceTypesChart data={deviceTypes} loading={loading} />
            <TopLocationsChart data={topLocations} loading={loading} />
        </div>
    );
};

export default AnalyticsCharts;