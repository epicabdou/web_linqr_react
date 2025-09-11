import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { Settings, User, Bell, Shield, CreditCard, LogOut, Save } from 'lucide-react';
import { $userEmail, $isPremium, authActions } from '../stores/authStore';
import Button from './ui/Button';
import Input from './ui/Input';

const SettingsView: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = useStore($userEmail);
    const isPremium = useStore($isPremium);

    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing'>('profile');
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: userEmail || '',
        phone: '',
        company: '',
        title: ''
    });

    const tabs = [
        { key: 'profile', label: 'Profile', icon: User },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'privacy', label: 'Privacy', icon: Shield },
        { key: 'billing', label: 'Billing', icon: CreditCard }
    ];

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // Implement profile update logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
            // You would call an API to update user profile here
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authActions.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Your first name"
                    />
                    <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Your last name"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                    />
                    <Input
                        label="Company"
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Your company"
                    />
                    <Input
                        label="Job Title"
                        value={profileData.title}
                        onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Your job title"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    icon={Save}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="font-medium text-gray-900">Card Scans</h4>
                        <p className="text-sm text-gray-600">Get notified when someone scans your card</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="font-medium text-gray-900">New Contacts</h4>
                        <p className="text-sm text-gray-600">Get notified when you receive new contacts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Receive weekly analytics reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Public Profile</h4>
                    <p className="text-sm text-gray-600 mb-3">Control who can see your profile information</p>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Everyone</option>
                        <option>Contacts only</option>
                        <option>Private</option>
                    </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Data Collection</h4>
                    <p className="text-sm text-gray-600 mb-3">Allow collection of analytics data</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing & Subscription</h3>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {isPremium ? 'Premium Plan' : 'Free Plan'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {isPremium
                                ? 'Unlimited cards, analytics, and premium features'
                                : 'Limited to 1 card with basic features'
                            }
                        </p>
                    </div>
                    {!isPremium && (
                        <Button onClick={() => navigate('/upgrade')}>
                            Upgrade to Premium
                        </Button>
                    )}
                </div>
            </div>

            {isPremium && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">Payment Method</h4>
                        <p className="text-sm text-gray-600 mt-1">**** **** **** 4242</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                            Update payment method
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">Next Billing Date</h4>
                        <p className="text-sm text-gray-600 mt-1">December 15, 2024</p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab();
            case 'notifications':
                return renderNotificationsTab();
            case 'privacy':
                return renderPrivacyTab();
            case 'billing':
                return renderBillingTab();
            default:
                return renderProfileTab();
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">Manage your account preferences and settings</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;