import React, { useState } from 'react';
import {
    TrendingUp,
    Eye,
    Users,
    Calendar,
    ExternalLink,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card } from '../../types';

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

interface AnalyticsCardPerformanceProps {
    cards: Card[];
    performanceData: CardPerformanceData[];
    loading?: boolean;
    onViewCard?: (cardId: number) => void;
    onEditCard?: (cardId: number) => void;
}

const CardPerformanceRow: React.FC<{
    card: CardPerformanceData;
    rank: number;
    onViewCard?: (cardId: number) => void;
    onEditCard?: (cardId: number) => void;
}> = ({ card, rank, onViewCard, onEditCard }) => {
    const [expanded, setExpanded] = useState(false);

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank.toString();
    };

    const getPerformanceColor = (rate: number) => {
        if (rate >= 20) return 'text-green-600 bg-green-50';
        if (rate >= 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const formatLastScanned = (dateString?: string) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
            <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">
                            {getRankBadge(rank)}
                        </div>

                        {/* Card Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900 truncate">
                                    {card.name}
                                </h4>
                                {!card.isActive && (
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            {card.title && (
                                <p className="text-sm text-gray-600 truncate">{card.title}</p>
                            )}
                        </div>

                        {/* Key Metrics */}
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{card.totalScans}</div>
                                <div className="text-gray-500">Total Scans</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{card.monthlyScans}</div>
                                <div className="text-gray-500">This Month</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{card.contactsGenerated}</div>
                                <div className="text-gray-500">Contacts</div>
                            </div>
                            <div className="text-center">
                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(card.conversionRate)}`}>
                                    {card.conversionRate.toFixed(1)}%
                                </div>
                                <div className="text-gray-500">Conversion</div>
                            </div>
                        </div>
                    </div>

                    {/* Expand/Collapse */}
                    <div className="flex items-center space-x-2">
                        {expanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>

                {/* Mobile Metrics (visible on small screens) */}
                <div className="md:hidden mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span>{card.totalScans} scans</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{card.contactsGenerated} contacts</span>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Detailed Stats */}
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Performance Details</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Weekly scans:</span>
                                    <span className="font-medium">{card.weeklyScans}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Conversion rate:</span>
                                    <span className={`font-medium ${card.conversionRate >= 15 ? 'text-green-600' : card.conversionRate >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {card.conversionRate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last scanned:</span>
                                    <span className="font-medium">{formatLastScanned(card.lastScanned)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${card.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                        {card.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trends */}
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Recent Trends</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-gray-600">Weekly growth:</span>
                                    <span className="font-medium text-green-600">
                                        {card.weeklyScans > 0 ? '+' : ''}{card.weeklyScans}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="text-gray-600">Monthly total:</span>
                                    <span className="font-medium">{card.monthlyScans}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Quick Actions</h5>
                            <div className="flex flex-col space-y-2">
                                {onViewCard && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewCard(card.id);
                                        }}
                                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View Card</span>
                                    </button>
                                )}
                                {onEditCard && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditCard(card.id);
                                        }}
                                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        <span>Edit Card</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AnalyticsCardPerformance: React.FC<AnalyticsCardPerformanceProps> = ({
                                                                               cards,
                                                                               performanceData,
                                                                               loading = false,
                                                                               onViewCard,
                                                                               onEditCard
                                                                           }) => {
    const [sortBy, setSortBy] = useState<'totalScans' | 'monthlyScans' | 'conversionRate'>('totalScans');

    const sortedData = [...performanceData].sort((a, b) => {
        return b[sortBy] - a[sortBy];
    });

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                                <div className="flex space-x-4">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="w-16 h-8 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (performanceData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Performance</h3>
                <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No performance data available</p>
                    <p className="text-sm text-gray-400">Create and share cards to see performance metrics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
                    Card Performance Ranking
                </h3>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="totalScans">Total Scans</option>
                        <option value="monthlyScans">Monthly Scans</option>
                        <option value="conversionRate">Conversion Rate</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {sortedData.map((card, index) => (
                    <CardPerformanceRow
                        key={card.id}
                        card={card}
                        rank={index + 1}
                        onViewCard={onViewCard}
                        onEditCard={onEditCard}
                    />
                ))}
            </div>

            {performanceData.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-800">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">Pro Tip:</span>
                        <span>Cards with higher conversion rates generate more meaningful connections!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsCardPerformance;