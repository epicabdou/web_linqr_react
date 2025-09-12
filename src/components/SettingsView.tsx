import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $userEmail, $isPremium, authActions } from '../stores/authStore';
import Loading from './ui/Loading';

// Import the new settings components
import SettingsHeader from './settings/SettingsHeader';
import SettingsSidebar from './settings/SettingsSidebar';
import ProfileSettings from './settings/ProfileSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import NotificationSettings from './settings/NotificationSettings';
import PrivacySettings from './settings/PrivacySettings';
import BillingSettings from './settings/BillingSettings';
import PreferencesSettings from './settings/PreferencesSettings';
import DevicesSettings from './settings/DevicesSettings';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'billing' | 'preferences' | 'devices';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    title: string;
    bio: string;
    location: string;
    website: string;
    avatarUrl?: string;
}

interface AppearanceData {
    theme: 'light' | 'dark' | 'system';
    accentColor: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo';
    reduceMotion: boolean;
    compactMode: boolean;
}

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

const SettingsView: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = useStore($userEmail);
    const isPremium = useStore($isPremium);

    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [loading, setLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Profile data state
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: userEmail || '',
        phone: '',
        company: '',
        title: '',
        bio: '',
        location: '',
        website: '',
        avatarUrl: undefined
    });

    // Appearance data state
    const [appearanceData, setAppearanceData] = useState<AppearanceData>({
        theme: 'system',
        accentColor: 'blue',
        reduceMotion: false,
        compactMode: false
    });

    // Notification preferences state
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
        cardScans: true,
        newContacts: true,
        weeklyReports: true,
        monthlyReports: false,
        securityAlerts: true,
        paymentUpdates: true,
        productUpdates: false,
        marketingEmails: false,
        pushNotifications: true,
        emailNotifications: true,
        desktopNotifications: false,
        soundEnabled: true
    });

    // Load user settings on mount
    useEffect(() => {
        loadUserSettings();
    }, []);

    const loadUserSettings = async () => {
        setLoading(true);
        try {
            // In a real app, you'd fetch user settings from your API
            // For now, we'll use localStorage or default values
            const savedAppearance = localStorage.getItem('appearance-settings');
            if (savedAppearance) {
                setAppearanceData(JSON.parse(savedAppearance));
            }

            const savedNotifications = localStorage.getItem('notification-preferences');
            if (savedNotifications) {
                setNotificationPreferences(JSON.parse(savedNotifications));
            }

            // Apply theme immediately
            const theme = JSON.parse(savedAppearance || '{}').theme || 'system';
            applyTheme(theme);
        } catch (error) {
            console.error('Error loading user settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
        const root = document.documentElement;

        if (theme === 'system') {
            // Use system preference
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemPreference === 'dark');
        } else {
            root.classList.toggle('dark', theme === 'dark');
        }
    };

    // Handle profile changes
    const handleProfileChange = (changes: Partial<ProfileData>) => {
        setProfileData(prev => ({ ...prev, ...changes }));
        setHasUnsavedChanges(true);
    };

    const handleAvatarUpload = async (file: File) => {
        setLoading(true);
        try {
            // In a real app, you'd upload to your storage service
            const fakeUrl = URL.createObjectURL(file);
            handleProfileChange({ avatarUrl: fakeUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle appearance changes
    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        const newAppearanceData = { ...appearanceData, theme };
        setAppearanceData(newAppearanceData);
        applyTheme(theme);
        localStorage.setItem('appearance-settings', JSON.stringify(newAppearanceData));
    };

    // Handle notification changes
    const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
        const newPreferences = { ...notificationPreferences, [key]: value };
        setNotificationPreferences(newPreferences);
        localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));
    };

    const handleTestNotification = async () => {
        // Send a test notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('LinQR Test Notification', {
                body: 'Your notification settings are working correctly!',
                icon: '/favicon.ico'
            });
        } else if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification('LinQR Test Notification', {
                    body: 'Your notification settings are working correctly!',
                    icon: '/favicon.ico'
                });
            }
        }
    };

    // Save all changes
    const handleSave = async () => {
        setLoading(true);
        try {
            // In a real app, you'd send the data to your API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call

            // Save to localStorage (in real app, this would be done via API)
            localStorage.setItem('profile-data', JSON.stringify(profileData));

            setHasUnsavedChanges(false);

            // Show success message (you could implement a toast notification)
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to sign out?');
            if (!confirmLeave) return;
        }

        try {
            await authActions.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileSettings
                        profileData={profileData}
                        onProfileChange={handleProfileChange}
                        onAvatarUpload={handleAvatarUpload}
                        isLoading={loading}
                    />
                );

            case 'appearance':
                return (
                    <AppearanceSettings
                        currentTheme={appearanceData.theme}
                        currentAccentColor={appearanceData.accentColor}
                        onThemeChange={handleThemeChange}
                        onAccentColorChange={handleAccentColorChange}
                        reduceMotion={appearanceData.reduceMotion}
                        onReduceMotionChange={handleReduceMotionChange}
                        compactMode={appearanceData.compactMode}
                        onCompactModeChange={handleCompactModeChange}
                    />
                );

            case 'notifications':
                return (
                    <NotificationSettings
                        preferences={notificationPreferences}
                        onPreferenceChange={handleNotificationChange}
                        onTestNotification={handleTestNotification}
                        isLoading={loading}
                    />
                );

            case 'privacy':
                return <PrivacySettings />;

            case 'billing':
                return <BillingSettings isPremium={isPremium} onUpgrade={() => navigate('/upgrade')} />;

            case 'preferences':
                return <PreferencesSettings />;

            case 'devices':
                return <DevicesSettings />;

            default:
                return null;
        }
    };

    if (loading && activeTab === 'profile' && !profileData.email) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Loading centered text="Loading settings..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <SettingsHeader
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
                isSaving={loading}
            />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <SettingsSidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onLogout={handleLogout}
                    isPremium={isPremium}
                />

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border p-8">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Unsaved changes warning */}
            {hasUnsavedChanges && (
                <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-yellow-800">Unsaved Changes</h3>
                            <p className="text-sm text-yellow-700 mt-1">You have unsaved changes in your profile.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsView;', JSON.stringify(newAppearanceData));
};

const handleAccentColorChange = (color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo') => {
    const newAppearanceData = { ...appearanceData, accentColor: color };
    setAppearanceData(newAppearanceData);
    localStorage.setItem('appearance-settings', JSON.stringify(newAppearanceData));

    // Apply accent color to CSS variables (you'd implement this based on your design system)
    document.documentElement.style.setProperty('--accent-color', getAccentColorValue(color));
};

const getAccentColorValue = (color: string) => {
    const colors = {
        blue: '#3b82f6',
        purple: '#8b5cf6',
        green: '#10b981',
        orange: '#f59e0b',
        pink: '#ec4899',
        indigo: '#6366f1'
    };
    return colors[color as keyof typeof colors];
};

const handleReduceMotionChange = (reduce: boolean) => {
    const newAppearanceData = { ...appearanceData, reduceMotion: reduce };
    setAppearanceData(newAppearanceData);
    localStorage.setItem('appearance-settings', JSON.stringify(newAppearanceData));

    // Apply reduced motion preference
    document.documentElement.style.setProperty('--animation-duration', reduce ? '0s' : '0.2s');
};

const handleCompactModeChange = (compact: boolean) => {
    const newAppearanceData = { ...appearanceData, compactMode: compact };
    setAppearanceData(newAppearanceData);
    localStorage.setItem('appearance-settings