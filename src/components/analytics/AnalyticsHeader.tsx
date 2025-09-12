import React from 'react';
import { Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface AnalyticsHeaderProps {
    timeRange: '7d' | '30d' | '90d' | '1y';
    onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
    onExport?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    totalScans: number;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
                                                             timeRange,
                                                             onTimeRangeChange,
                                                             onExport,
                                                             onRefresh,
                                                             isLoading = false,
                                                             totalScans
                                                         }) => {
    const timeRanges = [
        { key: '7d' as const, label: '7 days', description: 'Last week' },
        { key: '30d' as const, label: '30 days', description: 'Last month' },
        { key: '90d' as const, label: '90 days', description: 'Last 3 months' },
        { key: '1y' as const, label: '1 year', description: 'Last 12 months' }
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">
                    Track your networking performance and engagement insights
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Total scans: {totalScans.toLocaleString()}</span>
                    <span>•</span>
                    <span>Viewing {timeRanges.find(r => r.key === timeRange)?.description.toLowerCase()}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-0">
                {/* Time Range Selector */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    {timeRanges.map((range) => (
                        <button
                            key={range.key}
                            onClick={() => onTimeRangeChange(range.key)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                timeRange === range.key
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    {/* Refresh Button */}
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isLoading}
                            icon={RefreshCw}
                            className={isLoading ? 'animate-spin' : ''}
                        >
                            {isLoading ? 'Loading...' : 'Refresh'}
                        </Button>
                    )}

                    {/* Export Button */}
                    {onExport && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onExport}
                            icon={Download}
                        >
                            Export
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsHeader;