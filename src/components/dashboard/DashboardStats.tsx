import React from 'react';
import { QrCode, Eye, TrendingUp, Users } from 'lucide-react';

interface DashboardStatsProps {
    cardsCount: number;
    totalScans: number;
    recentViews: number;
    isPremium: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
                                                           cardsCount,
                                                           totalScans,
                                                           recentViews,
                                                           isPremium
                                                       }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Cards */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <QrCode className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Cards</p>
                        <p className="text-2xl font-bold text-gray-900">{cardsCount}</p>
                        <p className="text-xs text-gray-500">
                            {isPremium ? `${5 - cardsCount} remaining` : 'Free plan'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Total Views */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
                        <p className="text-xs text-green-600">All time</p>
                    </div>
                </div>
            </div>

            {/* Recent Views */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Recent Views</p>
                        <p className="text-2xl font-bold text-gray-900">+{recentViews}</p>
                        <p className="text-xs text-purple-600">This month</p>
                    </div>
                </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${isPremium ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        <Users className={`h-6 w-6 ${isPremium ? 'text-yellow-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Account</p>
                        <p className="text-2xl font-bold text-gray-900">{isPremium ? 'Premium' : 'Free'}</p>
                        <p className="text-xs text-gray-500">
                            {isPremium ? 'All features unlocked' : 'Limited features'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;