// Enhanced SettingsView.tsx with URL routing and persistence
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Settings, User, Bell, Shield, CreditCard, Palette, Globe } from 'lucide-react';
import { $user, $userProfile, $isPremium } from '../stores/authStore';
import {
    ProfileSettings,
    AccountSettings,
    SecuritySettings,
    NotificationSettings,
    SubscriptionSettings,
    PreferencesSettings
} from './settings';
import type { SettingsTab } from '../types/settings';

const SettingsView: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const user = useStore($user);
    const userProfile = useStore($userProfile);
    const isPremium = useStore($isPremium);

    // Get active tab from URL or default to 'profile'
    const activeTabFromUrl = searchParams.get('tab') as SettingsTab['id'] || 'profile';
    const [activeTab, setActiveTab] = useState<SettingsTab['id']>(activeTabFromUrl);

    // Update URL when tab changes
    useEffect(() => {
        if (activeTab !== activeTabFromUrl) {
            setSearchParams({ tab: activeTab });
        }
    }, [activeTab, activeTabFromUrl, setSearchParams]);

    // Sync with URL changes
    useEffect(() => {
        setActiveTab(activeTabFromUrl);
    }, [activeTabFromUrl]);

    const settingsTabs: SettingsTab[] = [
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            description: 'Manage your personal information'
        },
        {
            id: 'account',
            label: 'Account',
            icon: Settings,
            description: 'Account settings and data management'
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            description: 'Password and security options'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            description: 'Manage your notification preferences'
        },
        {
            id: 'subscription',
            label: 'Subscription',
            icon: CreditCard,
            description: 'Manage your subscription and billing',
            badge: isPremium ? 'Premium' : 'Free'
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Palette,
            description: 'App theme and display settings'
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings user={user} userProfile={userProfile} />;
            case 'account':
                return <AccountSettings user={user} userProfile={userProfile} />;
            case 'security':
                return <SecuritySettings />;
            case 'notifications':
                return <NotificationSettings userProfile={userProfile} />;
            case 'subscription':
                return <SubscriptionSettings isPremium={isPremium} user={user} />;
            case 'preferences':
                return <PreferencesSettings userProfile={userProfile} />;
            default:
                return <ProfileSettings user={user} userProfile={userProfile} />;
        }
    };

    // Breadcrumb navigation
    const currentTab = settingsTabs.find(tab => tab.id === activeTab);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with Breadcrumb */}
            <div className="mb-8">
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-gray-700 transition-colors"
                    >
                        Dashboard
                    </button>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Settings</span>
                    {currentTab && (
                        <>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{currentTab.label}</span>
                        </>
                    )}
                </nav>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="mt-2 text-gray-600">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Mobile Tab Selector */}
                    <div className="lg:hidden">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as SettingsTab['id'])}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {settingsTabs.map((tab) => (
                                <option key={tab.id} value={tab.id}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Navigation - Hidden on mobile */}
                <div className="lg:w-64 flex-shrink-0 hidden lg:block">
                    <nav className="sticky top-8 space-y-2">
                        {settingsTabs.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                            <div>
                                                <div className="font-medium">{tab.label}</div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {tab.description}
                                                </div>
                                            </div>
                                        </div>
                                        {tab.badge && (
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                tab.badge === 'Premium'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {tab.badge}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;