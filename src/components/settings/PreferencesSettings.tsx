import React, { useState } from 'react';
import {
    Globe,
    Clock,
    Calendar,
    MapPin,
    Languages,
    Zap,
    Download,
    Upload,
    FileText,
    Database,
    Wifi,
    WifiOff,
    Smartphone,
    RefreshCw,
    HardDrive,
    Activity
} from 'lucide-react';
import Button from '../ui/Button';

interface PreferencesData {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    startOfWeek: string;
    currency: string;
    numberFormat: string;
    autoDetectLocation: boolean;
    offlineMode: boolean;
    autoSave: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    dataRetention: '1month' | '3months' | '6months' | '1year' | 'forever';
    autoSync: boolean;
    lowDataMode: boolean;
    cacheSize: '100mb' | '500mb' | '1gb' | '2gb';
}

const PreferencesSettings: React.FC = () => {
    const [preferences, setPreferences] = useState<PreferencesData>({
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        startOfWeek: 'sunday',
        currency: 'USD',
        numberFormat: '1,234.56',
        autoDetectLocation: true,
        offlineMode: false,
        autoSave: true,
        backupFrequency: 'weekly',
        dataRetention: '1year',
        autoSync: true,
        lowDataMode: false,
        cacheSize: '500mb'
    });

    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [lastBackup, setLastBackup] = useState('2 hours ago');

    const updatePreference = <K extends keyof PreferencesData>(
        key: K,
        value: PreferencesData[K]
    ) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        // Save to localStorage in real implementation
        localStorage.setItem('user-preferences', JSON.stringify({ ...preferences, [key]: value }));
    };

    const languages = [
        { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
        { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
        { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
        { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
        { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
        { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
        { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' }
    ];

    const timezones = [
        { value: 'America/New_York', label: 'Eastern Time (UTC-5)', region: 'North America' },
        { value: 'America/Chicago', label: 'Central Time (UTC-6)', region: 'North America' },
        { value: 'America/Denver', label: 'Mountain Time (UTC-7)', region: 'North America' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (UTC-8)', region: 'North America' },
        { value: 'America/Toronto', label: 'Toronto (UTC-5)', region: 'North America' },
        { value: 'Europe/London', label: 'London (UTC+0)', region: 'Europe' },
        { value: 'Europe/Paris', label: 'Paris (UTC+1)', region: 'Europe' },
        { value: 'Europe/Berlin', label: 'Berlin (UTC+1)', region: 'Europe' },
        { value: 'Europe/Rome', label: 'Rome (UTC+1)', region: 'Europe' },
        { value: 'Europe/Madrid', label: 'Madrid (UTC+1)', region: 'Europe' },
        { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', region: 'Asia' },
        { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)', region: 'Asia' },
        { value: 'Asia/Seoul', label: 'Seoul (UTC+9)', region: 'Asia' },
        { value: 'Asia/Mumbai', label: 'Mumbai (UTC+5:30)', region: 'Asia' },
        { value: 'Asia/Dubai', label: 'Dubai (UTC+4)', region: 'Asia' },
        { value: 'Australia/Sydney', label: 'Sydney (UTC+11)', region: 'Oceania' },
        { value: 'Australia/Melbourne', label: 'Melbourne (UTC+11)', region: 'Oceania' },
        { value: 'Pacific/Auckland', label: 'Auckland (UTC+13)', region: 'Oceania' }
    ];

    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' }
    ];

    const dateFormats = [
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)', example: '12/31/2024', region: 'US' },
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)', example: '31/12/2024', region: 'UK/EU' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)', example: '2024-12-31', region: 'ISO' },
        { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (DE)', example: '31.12.2024', region: 'Germany' },
        { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (IN)', example: '31-12-2024', region: 'India' },
        { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (JP)', example: '2024/12/31', region: 'Japan' }
    ];

    const numberFormats = [
        { value: '1,234.56', label: '1,234.56 (US/UK)', description: 'Comma thousands, period decimal' },
        { value: '1.234,56', label: '1.234,56 (DE/FR)', description: 'Period thousands, comma decimal' },
        { value: '1 234.56', label: '1 234.56 (FR)', description: 'Space thousands, period decimal' },
        { value: '1 234,56', label: '1 234,56 (RU)', description: 'Space thousands, comma decimal' },
        { value: '1\'234.56', label: '1\'234.56 (CH)', description: 'Apostrophe thousands, period decimal' }
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

    const handleExportSettings = async () => {
        setIsExporting(true);
        try {
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            const blob = new Blob([JSON.stringify(preferences, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'linqr-preferences.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const text = await file.text();
            const importedPreferences = JSON.parse(text);
            setPreferences({ ...preferences, ...importedPreferences });
            console.log('Settings imported successfully');
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import settings. Please check the file format.');
        } finally {
            setIsImporting(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleResetToDefaults = () => {
        if (window.confirm('Are you sure you want to reset all preferences to default values? This action cannot be undone.')) {
            const defaultPreferences: PreferencesData = {
                language: 'en',
                timezone: 'America/New_York',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
                startOfWeek: 'sunday',
                currency: 'USD',
                numberFormat: '1,234.56',
                autoDetectLocation: true,
                offlineMode: false,
                autoSave: true,
                backupFrequency: 'weekly',
                dataRetention: '1year',
                autoSync: true,
                lowDataMode: false,
                cacheSize: '500mb'
            };
            setPreferences(defaultPreferences);
            localStorage.setItem('user-preferences', JSON.stringify(defaultPreferences));
        }
    };

    return (
        <div className="space-y-10">
            {/* Language & Region */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Languages className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Language & Region</h3>
                        <p className="text-sm text-gray-600">Configure your language and regional preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Language Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Display Language
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                            {languages.map((lang) => (
                                <label
                                    key={lang.code}
                                    className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        preferences.language === lang.code ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={lang.code}
                                        checked={preferences.language === lang.code}
                                        onChange={(e) => updatePreference('language', e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-2xl">{lang.flag}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{lang.native}</p>
                                        <p className="text-sm text-gray-500">{lang.name}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Timezone Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Timezone
                        </label>
                        <select
                            value={preferences.timezone}
                            onChange={(e) => updatePreference('timezone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {['North America', 'Europe', 'Asia', 'Oceania'].map(region => (
                                <optgroup key={region} label={region}>
                                    {timezones.filter(tz => tz.region === region).map((tz) => (
                                        <option key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm text-blue-800">
                                <Clock className="h-4 w-4" />
                                <span>Current time: {new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Format Preferences */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Date, Time & Number Formats</h3>
                        <p className="text-sm text-gray-600">Customize how dates, times, and numbers are displayed</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Date Format */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Date Format
                        </label>
                        <div className="space-y-2">
                            {dateFormats.map((format) => (
                                <label key={format.value} className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                    preferences.dateFormat === format.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="dateFormat"
                                            value={format.value}
                                            checked={preferences.dateFormat === format.value}
                                            onChange={(e) => updatePreference('dateFormat', e.target.value)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{format.label}</p>
                                            <p className="text-xs text-gray-500">{format.region}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 font-mono">{format.example}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Time Format */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Time Format
                        </label>
                        <div className="space-y-2">
                            <label className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                preferences.timeFormat === '12h' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="timeFormat"
                                        value="12h"
                                        checked={preferences.timeFormat === '12h'}
                                        onChange={(e) => updatePreference('timeFormat', e.target.value as '12h' | '24h')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">12-hour</p>
                                        <p className="text-xs text-gray-500">AM/PM format</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600 font-mono">2:30 PM</span>
                            </label>
                            <label className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                preferences.timeFormat === '24h' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="timeFormat"
                                        value="24h"
                                        checked={preferences.timeFormat === '24h'}
                                        onChange={(e) => updatePreference('timeFormat', e.target.value as '12h' | '24h')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">24-hour</p>
                                        <p className="text-xs text-gray-500">Military time</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600 font-mono">14:30</span>
                            </label>
                        </div>
                    </div>

                    {/* Number Format */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Number Format
                        </label>
                        <div className="space-y-2">
                            {numberFormats.map((format) => (
                                <label key={format.value} className={`flex flex-col p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                    preferences.numberFormat === format.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="numberFormat"
                                                value={format.value}
                                                checked={preferences.numberFormat === format.value}
                                                onChange={(e) => updatePreference('numberFormat', e.target.value)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-gray-900 font-mono">{format.label}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-6">{format.description}</p>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency & Calendar */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Currency & Calendar</h3>
                        <p className="text-sm text-gray-600">Set your preferred currency and calendar settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Currency */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Preferred Currency
                        </label>
                        <select
                            value={preferences.currency}
                            onChange={(e) => updatePreference('currency', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {currencies.map((currency) => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.flag} {currency.symbol} {currency.name} ({currency.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start of Week */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Start of Week
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <label key={day} className="text-center">
                                    <input
                                        type="radio"
                                        name="startOfWeek"
                                        value={day.toLowerCase()}
                                        checked={preferences.startOfWeek === day.toLowerCase()}
                                        onChange={(e) => updatePreference('startOfWeek', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        preferences.startOfWeek === day.toLowerCase()
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}>
                                        <span className="text-sm font-medium">
                                            {day.substring(0, 3)}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Location & Connectivity */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Location & Connectivity</h3>
                        <p className="text-sm text-gray-600">Configure location services and connectivity options</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Auto-detect Location */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <MapPin className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Auto-detect Location</h4>
                                <p className="text-sm text-gray-600">Allow location detection for analytics and regional features</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={preferences.autoSync}
                            onChange={(value) => updatePreference('autoSync', value)}
                        />
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Database className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Data Management</h3>
                        <p className="text-sm text-gray-600">Configure data storage, backup, and retention settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Storage & Cache */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Cache Size Limit
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: '100mb', label: '100 MB', description: 'Minimal storage' },
                                    { value: '500mb', label: '500 MB', description: 'Recommended' },
                                    { value: '1gb', label: '1 GB', description: 'Standard' },
                                    { value: '2gb', label: '2 GB', description: 'Maximum performance' }
                                ].map((option) => (
                                    <label key={option.value} className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                        preferences.cacheSize === option.value ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                                    }`}>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="cacheSize"
                                                value={option.value}
                                                checked={preferences.cacheSize === option.value}
                                                onChange={(e) => updatePreference('cacheSize', e.target.value as any)}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{option.label}</p>
                                                <p className="text-xs text-gray-500">{option.description}</p>
                                            </div>
                                        </div>
                                        <HardDrive className="h-4 w-4 text-gray-400" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Auto Save */}
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <Activity className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Auto Save</h4>
                                    <p className="text-sm text-gray-600">Automatically save changes as you work</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                checked={preferences.autoSave}
                                onChange={(value) => updatePreference('autoSave', value)}
                            />
                        </div>
                    </div>

                    {/* Backup & Retention */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Backup Frequency
                            </label>
                            <select
                                value={preferences.backupFrequency}
                                onChange={(e) => updatePreference('backupFrequency', e.target.value as any)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="daily">Daily backups</option>
                                <option value="weekly">Weekly backups</option>
                                <option value="monthly">Monthly backups</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Data Retention Period
                            </label>
                            <select
                                value={preferences.dataRetention}
                                onChange={(e) => updatePreference('dataRetention', e.target.value as any)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                            >
                                <option value="1month">1 month</option>
                                <option value="3months">3 months</option>
                                <option value="6months">6 months</option>
                                <option value="1year">1 year</option>
                                <option value="forever">Keep forever</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Last Backup</span>
                                <span className="text-sm text-gray-600">{lastBackup}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Next backup scheduled for tomorrow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Import/Export & Reset */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Settings Management</h3>
                        <p className="text-sm text-gray-600">Import, export, or reset your preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Export Settings */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                                <Download className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Export Settings</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Download your current preferences as a backup file
                            </p>
                            <Button
                                onClick={handleExportSettings}
                                disabled={isExporting}
                                className="w-full"
                                variant="outline"
                            >
                                {isExporting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Import Settings */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                                <Upload className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Import Settings</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Restore preferences from a previously exported file
                            </p>
                            <label className="w-full">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportSettings}
                                    disabled={isImporting}
                                    className="sr-only"
                                />
                                <div className={`w-full px-4 py-2 border border-green-300 rounded-lg cursor-pointer hover:bg-green-100 transition-colors text-center ${
                                    isImporting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}>
                                    {isImporting ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 inline mr-2" />
                                            Import
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Reset to Defaults */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
                                <RefreshCw className="h-6 w-6 text-red-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Reset to Defaults</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Restore all preferences to their original settings
                            </p>
                            <Button
                                onClick={handleResetToDefaults}
                                variant="outline"
                                className="w-full text-red-600 border-red-300 hover:bg-red-100"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Settings Summary */}
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <Zap className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Settings Summary</h3>
                        <p className="text-sm text-gray-600">Overview of your current preferences</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Language & Region</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Language:</span>
                                    <span className="font-medium text-gray-900">
                                        {languages.find(l => l.code === preferences.language)?.native}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Timezone:</span>
                                    <span className="font-medium text-gray-900">
                                        {timezones.find(t => t.value === preferences.timezone)?.label.split(' ')[0]}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Currency:</span>
                                    <span className="font-medium text-gray-900">
                                        {currencies.find(c => c.code === preferences.currency)?.symbol} {preferences.currency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Formats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium text-gray-900 font-mono">{preferences.dateFormat}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium text-gray-900">{preferences.timeFormat === '12h' ? '12-hour' : '24-hour'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Numbers:</span>
                                    <span className="font-medium text-gray-900 font-mono">{preferences.numberFormat}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Data & Storage</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cache:</span>
                                    <span className="font-medium text-gray-900">{preferences.cacheSize.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Backup:</span>
                                    <span className="font-medium text-gray-900 capitalize">{preferences.backupFrequency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Retention:</span>
                                    <span className="font-medium text-gray-900">
                                        {preferences.dataRetention === 'forever' ? 'Forever' : preferences.dataRetention.replace(/(\d+)([a-z]+)/, '$1 $2')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Features</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Auto Save:</span>
                                    <span className={`font-medium ${preferences.autoSave ? 'text-green-600' : 'text-red-600'}`}>
                                        {preferences.autoSave ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Auto Sync:</span>
                                    <span className={`font-medium ${preferences.autoSync ? 'text-green-600' : 'text-red-600'}`}>
                                        {preferences.autoSync ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Low Data:</span>
                                    <span className={`font-medium ${preferences.lowDataMode ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {preferences.lowDataMode ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreferencesSettings;