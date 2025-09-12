import React from 'react';
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Palette,
    Globe,
    Smartphone,
    LogOut,
    Crown
} from 'lucide-react';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'billing' | 'preferences' | 'devices';

interface SettingsSidebarProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
    onLogout: () => void;
    isPremium: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
                                                             activeTab,
                                                             onTabChange,
                                                             onLogout,
                                                             isPremium
                                                         }) => {
    const tabs = [
        {
            key: 'profile' as const,
            label: 'Profile',
            icon: User,
            description: 'Personal information and account details'
        },
        {
            key: 'appearance' as const,
            label: 'Appearance',
            icon: Palette,
            description: 'Theme, colors, and visual preferences'
        },
        {
            key: 'notifications' as const,
            label: 'Notifications',
            icon: Bell,
            description: 'Email and push notification settings'
        },
        {
            key: 'privacy' as const,
            label: 'Privacy & Security',
            icon: Shield,
            description: 'Account security and data privacy'
        },
        {
            key: 'billing' as const,
            label: 'Billing & Plans',
            icon: CreditCard,
            description: 'Subscription and payment management'
        },
        {
            key: 'preferences' as const,
            label: 'Preferences',
            icon: Globe,
            description: 'Language, timezone, and regional settings'
        },
        {
            key: 'devices' as const,
            label: 'Devices & Sessions',
            icon: Smartphone,
            description: 'Manage active sessions and devices',
            premium: true
        }
    ];

    return (
        <div className="lg:w-80">
            {/* Premium Badge */}
            {isPremium && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-200 rounded-lg">
                            <Crown className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-yellow-800">Premium Account</h3>
                            <p className="text-sm text-yellow-700">All features unlocked</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isDisabled = tab.premium && !isPremium;
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => !isDisabled && onTabChange(tab.key)}
                            disabled={isDisabled}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                    : isDisabled
                                        ? 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                                        : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${
                                    isActive
                                        ? 'bg-blue-100'
                                        : isDisabled
                                            ? 'bg-gray-100'
                                            : 'bg-gray-100 group-hover:bg-gray-200'
                                }`}>
                                    <Icon className={`h-5 w-5 ${
                                        isActive
                                            ? 'text-blue-600'
                                            : isDisabled
                                                ? 'text-gray-400'
                                                : 'text-gray-600 group-hover:text-gray-700'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-medium ${
                                            isActive
                                                ? 'text-blue-900'
                                                : isDisabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-900'
                                        }`}>
                                            {tab.label}
                                        </span>
                                        {tab.premium && !isPremium && (
                                            <Crown className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </div>
                                    <p className={`text-sm mt-1 ${
                                        isActive
                                            ? 'text-blue-700'
                                            : isDisabled
                                                ? 'text-gray-400'
                                                : 'text-gray-600'
                                    }`}>
                                        {tab.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-4 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300"
                >
                    <div className="p-2 bg-red-50 rounded-lg">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="font-medium">Sign Out</span>
                        <p className="text-sm text-red-500">End your current session</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SettingsSidebar;