// PreferencesSettings.tsx
import React, { useState } from 'react';
import { Monitor, Sun, Moon, Globe, EyeOff } from 'lucide-react';
import Button from "../ui/Button.tsx";

interface PreferencesSettingsProps {
    userProfile: any;
}

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ userProfile }) => {
    const [preferences, setPreferences] = useState({
        theme: userProfile?.preferences?.theme || 'light',
        profileVisibility: userProfile?.preferences?.profileVisibility || 'public',
        language: 'en',
        timezone: 'UTC-5',
        analyticsSharing: true
    });

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Match your device settings' }
    ];

    const visibilityOptions = [
        { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can find your cards' },
        { value: 'private', label: 'Private', icon: EyeOff, description: 'Only people with the link can access' }
    ];

    const handlePreferenceChange = (key: string, value: any) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const RadioOption: React.FC<{
        name: string;
        value: string;
        selectedValue: string;
        onChange: (value: string) => void;
        label: string;
        description: string;
        icon: React.ComponentType<any>;
    }> = ({ name, value, selectedValue, onChange, label, description, icon: IconComponent }) => (
        <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
                type="radio"
                name={name}
                value={value}
                checked={selectedValue === value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </label>
    );

    const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>

            <div className="space-y-8">
                {/* Theme Settings */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="space-y-3">
                        {themeOptions.map((option) => (
                            <RadioOption
                                key={option.value}
                                name="theme"
                                value={option.value}
                                selectedValue={preferences.theme}
                                onChange={(value) => handlePreferenceChange('theme', value)}
                                label={option.label}
                                description={option.description}
                                icon={option.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* Profile Visibility */}
                <div className="border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                    <div className="space-y-3">
                        {visibilityOptions.map((option) => (
                            <RadioOption
                                key={option.value}
                                name="visibility"
                                value={option.value}
                                selectedValue={preferences.profileVisibility}
                                onChange={(value) => handlePreferenceChange('profileVisibility', value)}
                                label={option.label}
                                description={option.description}
                                icon={option.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* Language & Region */}
                <div className="border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Language
                            </label>
                            <select
                                value={preferences.language}
                                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timezone
                            </label>
                            <select
                                value={preferences.timezone}
                                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="UTC-8">Pacific Time (UTC-8)</option>
                                <option value="UTC-7">Mountain Time (UTC-7)</option>
                                <option value="UTC-6">Central Time (UTC-6)</option>
                                <option value="UTC-5">Eastern Time (UTC-5)</option>
                                <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                                <option value="UTC+1">Central European Time (UTC+1)</option>
                                <option value="UTC+8">China Standard Time (UTC+8)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Analytics Sharing</p>
                                <p className="text-sm text-gray-600">
                                    Help improve LinQR by sharing anonymous usage data
                                </p>
                            </div>
                            <Toggle
                                checked={preferences.analyticsSharing}
                                onChange={(value) => handlePreferenceChange('analyticsSharing', value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="border-t pt-8">
                    <Button>
                        Save Preferences
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesSettings;