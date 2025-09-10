import React from 'react';
import { QrCode, Settings } from 'lucide-react';

interface NavigationProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isPremium: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
                                                   currentView,
                                                   setCurrentView,
                                                   isPremium
                                               }) => {
    const navigationItems = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'cards', label: 'My Cards' },
        { key: 'contacts', label: 'Contacts' },
        { key: 'analytics', label: 'Analytics' }
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <QrCode className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">LinQR</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setCurrentView(item.key)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    currentView === item.key
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {!isPremium && (
                            <button
                                onClick={() => setCurrentView('upgrade')}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                                Upgrade to Premium
                            </button>
                        )}
                        <button
                            onClick={() => setCurrentView('settings')}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;