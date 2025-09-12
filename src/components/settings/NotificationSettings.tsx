// NotificationSettings.tsx
import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Users, BarChart3 } from 'lucide-react';
import AccountSettings from "@/components/settings/AccountSettings.tsx";

interface NotificationSettingsProps {
    userProfile: any;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ userProfile }) => {
    const [notifications, setNotifications] = useState({
        email: {
            newScans: true,
            weeklyReports: true,
            accountUpdates: true,
            marketing: false
        },
        push: {
            newScans: true,
            newContacts: true,
            cardShares: true
        }
    });

    const handleNotificationChange = (type: 'email' | 'push', setting: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [setting]: value
            }
        }));
    };

    const NotificationToggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                checked ? 'bg-blue-600' : 'bg-gray-200'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>

            <div className="space-y-8">
                {/* Email Notifications */}
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">New Card Scans</p>
                                <p className="text-sm text-gray-600">Get notified when someone scans your card</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.email.newScans}
                                onChange={(value) => handleNotificationChange('email', 'newScans', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Weekly Reports</p>
                                <p className="text-sm text-gray-600">Receive weekly analytics summaries</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.email.weeklyReports}
                                onChange={(value) => handleNotificationChange('email', 'weeklyReports', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Account Updates</p>
                                <p className="text-sm text-gray-600">Important updates about your account</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.email.accountUpdates}
                                onChange={(value) => handleNotificationChange('email', 'accountUpdates', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Marketing & Tips</p>
                                <p className="text-sm text-gray-600">Networking tips and product updates</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.email.marketing}
                                onChange={(value) => handleNotificationChange('email', 'marketing', value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="border-t pt-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">New Card Scans</p>
                                <p className="text-sm text-gray-600">Instant notifications for card scans</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.push.newScans}
                                onChange={(value) => handleNotificationChange('push', 'newScans', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">New Contacts</p>
                                <p className="text-sm text-gray-600">When someone adds you as a contact</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.push.newContacts}
                                onChange={(value) => handleNotificationChange('push', 'newContacts', value)}
                            />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Card Shares</p>
                                <p className="text-sm text-gray-600">When your card is shared with others</p>
                            </div>
                            <NotificationToggle
                                checked={notifications.push.cardShares}
                                onChange={(value) => handleNotificationChange('push', 'cardShares', value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;