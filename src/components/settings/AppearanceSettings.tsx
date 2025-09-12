import React, { useState } from 'react';
import {
    Sun,
    Moon,
    Monitor,
    Palette,
    Eye,
    Zap,
    Sparkles,
    Check
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo';

interface AppearanceSettingsProps {
    currentTheme: Theme;
    currentAccentColor: AccentColor;
    onThemeChange: (theme: Theme) => void;
    onAccentColorChange: (color: AccentColor) => void;
    reduceMotion: boolean;
    onReduceMotionChange: (reduce: boolean) => void;
    compactMode: boolean;
    onCompactModeChange: (compact: boolean) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
                                                                   currentTheme,
                                                                   currentAccentColor,
                                                                   onThemeChange,
                                                                   onAccentColorChange,
                                                                   reduceMotion,
                                                                   onReduceMotionChange,
                                                                   compactMode,
                                                                   onCompactModeChange
                                                               }) => {
    const themes = [
        {
            key: 'light' as const,
            name: 'Light',
            description: 'Clean and bright interface',
            icon: Sun,
            preview: 'bg-white border-gray-200'
        },
        {
            key: 'dark' as const,
            name: 'Dark',
            description: 'Easy on the eyes in low light',
            icon: Moon,
            preview: 'bg-gray-900 border-gray-700'
        },
        {
            key: 'system' as const,
            name: 'System',
            description: 'Follow your device settings',
            icon: Monitor,
            preview: 'bg-gradient-to-r from-white via-gray-100 to-gray-900 border-gray-400'
        }
    ];

    const accentColors = [
        { key: 'blue' as const, name: 'Blue', class: 'bg-blue-500', ring: 'ring-blue-500' },
        { key: 'purple' as const, name: 'Purple', class: 'bg-purple-500', ring: 'ring-purple-500' },
        { key: 'green' as const, name: 'Green', class: 'bg-green-500', ring: 'ring-green-500' },
        { key: 'orange' as const, name: 'Orange', class: 'bg-orange-500', ring: 'ring-orange-500' },
        { key: 'pink' as const, name: 'Pink', class: 'bg-pink-500', ring: 'ring-pink-500' },
        { key: 'indigo' as const, name: 'Indigo', class: 'bg-indigo-500', ring: 'ring-indigo-500' }
    ];

    return (
        <div className="space-y-8">
            {/* Theme Selection */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Palette className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isSelected = currentTheme === theme.key;

                        return (
                            <button
                                key={theme.key}
                                onClick={() => onThemeChange(theme.key)}
                                className={`relative p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                            >
                                {/* Preview */}
                                <div className={`w-full h-16 ${theme.preview} rounded-lg border-2 mb-3 relative overflow-hidden`}>
                                    <div className="absolute inset-2 bg-gray-200 rounded opacity-20"></div>
                                    <div className="absolute bottom-2 left-2 right-2 h-2 bg-gray-300 rounded opacity-30"></div>
                                    <div className="absolute bottom-2 left-2 w-8 h-2 bg-blue-500 rounded opacity-60"></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                {theme.name}
                                            </h4>
                                            <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                                {theme.description}
                                            </p>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="flex-shrink-0">
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Accent Colors */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Accent Color</h3>
                </div>

                <p className="text-gray-600 mb-4">
                    Choose an accent color to personalize buttons, links, and highlights throughout the app.
                </p>

                <div className="flex flex-wrap gap-3">
                    {accentColors.map((color) => {
                        const isSelected = currentAccentColor === color.key;

                        return (
                            <button
                                key={color.key}
                                onClick={() => onAccentColorChange(color.key)}
                                className={`group relative p-1 rounded-full transition-all duration-200 ${
                                    isSelected ? `ring-4 ring-offset-2 ${color.ring}` : 'hover:scale-110'
                                }`}
                            >
                                <div className={`w-12 h-12 ${color.class} rounded-full shadow-lg flex items-center justify-center`}>
                                    {isSelected && (
                                        <Check className="h-5 w-5 text-white" />
                                    )}
                                </div>
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {color.name}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Display Options */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Eye className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Display Options</h3>
                </div>

                <div className="space-y-4">
                    {/* Compact Mode */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">Compact Mode</h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    Beta
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Reduce spacing and padding for more content on screen
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={compactMode}
                                onChange={(e) => onCompactModeChange(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Reduce Motion */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">Reduce Motion</h4>
                                <Zap className="h-4 w-4 text-orange-500" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Minimize animations and transitions for better performance
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={reduceMotion}
                                onChange={(e) => onReduceMotionChange(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900">Sample Interface</h4>
                            <button className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                currentAccentColor === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                                    currentAccentColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                                        currentAccentColor === 'green' ? 'bg-green-500 hover:bg-green-600' :
                                            currentAccentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                                                currentAccentColor === 'pink' ? 'bg-pink-500 hover:bg-pink-600' :
                                                    'bg-indigo-500 hover:bg-indigo-600'
                            }`}>
                                Action Button
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-2">Card Preview</h5>
                                <div className={`w-full h-20 bg-gradient-to-r ${
                                    currentAccentColor === 'blue' ? 'from-blue-500 to-blue-600' :
                                        currentAccentColor === 'purple' ? 'from-purple-500 to-purple-600' :
                                            currentAccentColor === 'green' ? 'from-green-500 to-green-600' :
                                                currentAccentColor === 'orange' ? 'from-orange-500 to-orange-600' :
                                                    currentAccentColor === 'pink' ? 'from-pink-500 to-pink-600' :
                                                        'from-indigo-500 to-indigo-600'
                                } rounded-lg flex items-center justify-center text-white font-medium`}>
                                    Digital Business Card
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className={`h-2 ${
                                    currentAccentColor === 'blue' ? 'bg-blue-200' :
                                        currentAccentColor === 'purple' ? 'bg-purple-200' :
                                            currentAccentColor === 'green' ? 'bg-green-200' :
                                                currentAccentColor === 'orange' ? 'bg-orange-200' :
                                                    currentAccentColor === 'pink' ? 'bg-pink-200' :
                                                        'bg-indigo-200'
                                } rounded w-full`}></div>
                                <div className={`h-2 ${
                                    currentAccentColor === 'blue' ? 'bg-blue-300' :
                                        currentAccentColor === 'purple' ? 'bg-purple-300' :
                                            currentAccentColor === 'green' ? 'bg-green-300' :
                                                currentAccentColor === 'orange' ? 'bg-orange-300' :
                                                    currentAccentColor === 'pink' ? 'bg-pink-300' :
                                                        'bg-indigo-300'
                                } rounded w-2/3`}></div>
                                <div className={`h-2 ${
                                    currentAccentColor === 'blue' ? 'bg-blue-400' :
                                        currentAccentColor === 'purple' ? 'bg-purple-400' :
                                            currentAccentColor === 'green' ? 'bg-green-400' :
                                                currentAccentColor === 'orange' ? 'bg-orange-400' :
                                                    currentAccentColor === 'pink' ? 'bg-pink-400' :
                                                        'bg-indigo-400'
                                } rounded w-1/2`}></div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            This preview shows how your selected theme and accent color will appear throughout the application.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;