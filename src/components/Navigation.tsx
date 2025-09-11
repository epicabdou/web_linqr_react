import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { QrCode, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { $userEmail, $isPremium, authActions } from '../stores/authStore';

const Navigation: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = useStore($userEmail);
    const isPremium = useStore($isPremium);

    const navigationItems = [
        { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { key: 'cards', label: 'My Cards', path: '/cards' },
        { key: 'contacts', label: 'Contacts', path: '/contacts' },
        { key: 'analytics', label: 'Analytics', path: '/analytics' }
    ];

    const handleLogout = async () => {
        try {
            await authActions.signOut();
            navigate('/login');
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Helper function to check if a path is active
    const isActivePath = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <QrCode className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">LinQR</span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.key}
                                to={item.path}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    isActivePath(item.path)
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {!isPremium && (
                            <Link
                                to="/upgrade"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                                Upgrade to Premium
                            </Link>
                        )}

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50"
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                        {userEmail?.split('@')[0] || 'User'}
                                    </div>
                                    {isPremium && (
                                        <div className="text-xs text-purple-600 font-medium">Premium</div>
                                    )}
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {userEmail}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {isPremium ? 'Premium Account' : 'Free Account'}
                                        </div>
                                    </div>

                                    <Link
                                        to="/settings"
                                        onClick={() => setShowUserMenu(false)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 block"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
                <div className="flex space-x-1 px-4 py-2 overflow-x-auto">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                                isActivePath(item.path)
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Overlay to close user menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </nav>
    );
};

export default Navigation;