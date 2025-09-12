import React from 'react';
import {
    Bell,
    Mail,
    Smartphone,
    Users,
    Eye,
    BarChart3,
    Calendar,
    CreditCard,
    Shield,
    Volume2,
    VolumeX
} from 'lucide-react';

interface NotificationPreferences {
    cardScans: boolean;
    newContacts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    securityAlerts: boolean;
    paymentUpdates: boolean;
    productUpdates: boolean;
    marketingEmails: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    desktopNotifications: boolean;
    soundEnabled: boolean;
}

interface NotificationSettingsProps {
    preferences: NotificationPreferences;
    onPreferenceChange: (key: keyof NotificationPreferences, value: boolean) => void;
    onTestNotification: () => void;
    isLoading?: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
                                                                       preferences,
                                                                       onPreferenceChange,
                                                                       onTestNotification,
                                                                       isLoading = false
                                                                   }) => {
    const notificationGroups = [
        {
            title: 'Activity & Engagement',
            icon: Eye,
            color: 'blue',
            items: [
                {
                    key: 'cardScans' as keyof NotificationPreferences,
                    title: 'Card Scans',
                    description: 'Get notified when someone scans your digital card',
                    icon: Eye
                },
                {
                    key: 'newContacts' as keyof NotificationPreferences,
                    title: 'New Contacts',
                    description: 'Receive alerts when you get new contact submissions',
                    icon: Users
                }
            ]
        },
        {
            title: 'Reports & Analytics',
            icon: BarChart3,
            color: 'green',
            items: [
                {
                    key: 'weeklyReports' as keyof NotificationPreferences,
                    title: 'Weekly Analytics',
                    description: 'Get weekly summaries of your networking activity',
                    icon: Calendar
                },
                {
                    key: 'monthlyReports' as keyof NotificationPreferences,
                    title: 'Monthly Reports',
                    description: 'Comprehensive monthly performance reports',
                    icon: BarChart3
                }
            ]
        },
        {
            title: 'Security & Account',
            icon: Shield,
            color: 'red',
            items: [
                {
                    key: 'securityAlerts' as keyof NotificationPreferences,
                    title: 'Security Alerts',
                    description: 'Important security updates and login notifications',
                    icon: Shield,
                    important: true
                },
                {
                    key: 'paymentUpdates' as keyof NotificationPreferences,
                    title: 'Payment Updates',
                    description: 'Billing changes, payment confirmations, and renewals',
                    icon: CreditCard
                }
            ]
        },
        {
            title: 'Product & Marketing',
            icon: Mail,
            color: 'purple',
            items: [
                {
                    key: 'productUpdates' as keyof NotificationPreferences,
                    title: 'Product Updates',
                    description: 'New features, improvements, and platform changes',
                    icon: Bell
                },
                {
                    key: 'marketingEmails' as keyof NotificationPreferences,
                    title: 'Marketing Communications',
                    description: 'Tips, best practices, and promotional content',
                    icon: Mail
                }
            ]
        }
    ];

    const deliveryMethods = [
        {
            key: 'pushNotifications' as keyof NotificationPreferences,
            title: 'Push Notifications',
            description: 'Browser and mobile push notifications',
            icon: Smartphone
        },
        {
            key: 'emailNotifications' as keyof NotificationPreferences,
            title: 'Email Notifications',
            description: 'Receive notifications via email',
            icon: Mail
        },
        {
            key: 'desktopNotifications' as keyof NotificationPreferences,
            title: 'Desktop Notifications',
            description: 'System notifications on your desktop',
            icon: Bell
        }
    ];

    const ToggleSwitch: React.FC<{
        checked: boolean;
        onChange: (checked: boolean) => void;
        disabled?: boolean;
        size?: 'sm' | 'md';
    }> = ({ checked, onChange, disabled = false, size = 'md' }) => {
        const sizeClasses = {
            sm: 'w-9 h-5',
            md: 'w-11 h-6'
        };

        const thumbSizeClasses = {
            sm: 'after:h-4 after:w-4',
            md: 'after:h-5 after:w-5'
        };

        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className={`${sizeClasses[size]} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full ${thumbSizeClasses[size]} after:transition-all peer-checked:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
            </label>
        );
    };

    return (
        <div className="space-y-8">
            {/* Delivery Methods */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Methods</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-medium text-blue-900">Test Notifications</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Send a test notification to verify your settings are working
                            </p>
                        </div>
                        <button
                            onClick={onTestNotification}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                            Send Test
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {deliveryMethods.map((method) => {
                        const Icon = method.icon;
                        const isEnabled = preferences[method.key];

                        return (
                            <div
                                key={method.key}
                                className={`p-4 border-2 rounded-xl transition-all ${
                                    isEnabled
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg ${
                                        isEnabled ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                        <Icon className={`h-5 w-5 ${
                                            isEnabled ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <ToggleSwitch
                                        checked={isEnabled}
                                        onChange={(checked) => onPreferenceChange(method.key, checked)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <h4 className={`font-medium mb-1 ${
                                    isEnabled ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                    {method.title}
                                </h4>
                                <p className={`text-sm ${
                                    isEnabled ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                    {method.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sound Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                <div className="flex items-center space-x-3">
                    {preferences.soundEnabled ? (
                        <Volume2 className="h-5 w-5 text-green-600" />
                    ) : (
                        <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                        <h4 className="font-medium text-gray-900">Notification Sounds</h4>
                        <p className="text-sm text-gray-600">Play sound effects for notifications</p>
                    </div>
                </div>
                <ToggleSwitch
                    checked={preferences.soundEnabled}
                    onChange={(checked) => onPreferenceChange('soundEnabled', checked)}
                    disabled={isLoading}
                />
            </div>

            {/* Notification Categories */}
            {notificationGroups.map((group) => {
                const GroupIcon = group.icon;
                const colorClasses = {
                    blue: 'text-blue-600 bg-blue-50 border-blue-200',
                    green: 'text-green-600 bg-green-50 border-green-200',
                    red: 'text-red-600 bg-red-50 border-red-200',
                    purple: 'text-purple-600 bg-purple-50 border-purple-200'
                };

                return (
                    <div key={group.title}>
                        <div className="flex items-center space-x-2 mb-6">
                            <GroupIcon className={`h-5 w-5 ${group.color === 'blue' ? 'text-blue-600' : group.color === 'green' ? 'text-green-600' : group.color === 'red' ? 'text-red-600' : 'text-purple-600'}`} />
                            <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                        </div>

                        <div className="space-y-3">
                            {group.items.map((item) => {
                                const ItemIcon = item.icon;
                                const isEnabled = preferences[item.key];

                                return (
                                    <div
                                        key={item.key}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                            item.important
                                                ? 'bg-yellow-50 border-yellow-200'
                                                : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className={`p-2 rounded-lg ${
                                                item.important
                                                    ? 'bg-yellow-100'
                                                    : isEnabled
                                                        ? colorClasses[group.color as keyof typeof colorClasses].split(' ')[1] + ' ' + colorClasses[group.color as keyof typeof colorClasses].split(' ')[2]
                                                        : 'bg-gray-100'
                                            }`}>
                                                <ItemIcon className={`h-4 w-4 ${
                                                    item.important
                                                        ? 'text-yellow-600'
                                                        : isEnabled
                                                            ? colorClasses[group.color as keyof typeof colorClasses].split(' ')[0]
                                                            : 'text-gray-600'
                                                }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                    {item.important && (
                                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                            Required
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                        <ToggleSwitch
                                            checked={isEnabled}
                                            onChange={(checked) => onPreferenceChange(item.key, checked)}
                                            disabled={isLoading || (item.important && isEnabled)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-2">Notification Summary</h4>
                <div className="text-sm text-gray-600">
                    <p>
                        You have <strong>{Object.values(preferences).filter(Boolean).length}</strong> out of{' '}
                        <strong>{Object.keys(preferences).length}</strong> notification types enabled.
                    </p>
                    <p className="mt-2">
                        You can always change these settings later. Important security notifications cannot be disabled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;