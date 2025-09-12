import React from 'react';
import {
    Smartphone,
    Monitor,
    Tablet,
    MapPin,
    Clock,
    Shield,
    AlertTriangle,
    LogOut
} from 'lucide-react';
import Button from '../ui/Button';

interface Device {
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    location: string;
    lastActive: string;
    current: boolean;
    trusted: boolean;
}

const DevicesSettings: React.FC = () => {
    const mockDevices: Device[] = [
        {
            id: '1',
            name: 'MacBook Pro',
            type: 'desktop',
            browser: 'Safari 17.1',
            os: 'macOS Sonoma',
            location: 'San Francisco, CA',
            lastActive: 'Active now',
            current: true,
            trusted: true
        },
        {
            id: '2',
            name: 'iPhone 15 Pro',
            type: 'mobile',
            browser: 'Safari Mobile',
            os: 'iOS 17.1',
            location: 'San Francisco, CA',
            lastActive: '2 hours ago',
            current: false,
            trusted: true
        },
        {
            id: '3',
            name: 'iPad Air',
            type: 'tablet',
            browser: 'Safari Mobile',
            os: 'iPadOS 17.1',
            location: 'San Francisco, CA',
            lastActive: '1 day ago',
            current: false,
            trusted: true
        },
        {
            id: '4',
            name: 'Windows PC',
            type: 'desktop',
            browser: 'Chrome 119',
            os: 'Windows 11',
            location: 'New York, NY',
            lastActive: '3 days ago',
            current: false,
            trusted: false
        }
    ];

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            case 'desktop': return Monitor;
            default: return Monitor;
        }
    };

    const getDeviceColor = (type: string, trusted: boolean, current: boolean) => {
        if (current) return 'text-blue-600 bg-blue-100';
        if (!trusted) return 'text-red-600 bg-red-100';

        switch (type) {
            case 'mobile': return 'text-green-600 bg-green-100';
            case 'tablet': return 'text-purple-600 bg-purple-100';
            case 'desktop': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const handleSignOutDevice = (deviceId: string) => {
        if (window.confirm('Are you sure you want to sign out this device? You will need to sign in again on that device.')) {
            console.log('Sign out device:', deviceId);
            // Implement device sign out logic
        }
    };

    const handleTrustDevice = (deviceId: string) => {
        console.log('Trust device:', deviceId);
        // Implement device trust logic
    };

    const handleSignOutAll = () => {
        if (window.confirm('Are you sure you want to sign out all other devices? This will require you to sign in again on all your devices except this one.')) {
            console.log('Sign out all devices');
            // Implement sign out all devices logic
        }
    };

    return (
        <div className="space-y-8">
            {/* Current Session */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                            <h4 className="font-medium text-blue-900">Security Information</h4>
                            <p className="text-sm text-blue-700">
                                Manage your active sessions and trusted devices. Sign out suspicious sessions immediately.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {mockDevices.map((device) => {
                        const Icon = getDeviceIcon(device.type);
                        const colorClasses = getDeviceColor(device.type, device.trusted, device.current);

                        return (
                            <div
                                key={device.id}
                                className={`p-4 border-2 rounded-xl transition-all ${
                                    device.current
                                        ? 'border-blue-200 bg-blue-50'
                                        : device.trusted
                                            ? 'border-gray-200 bg-white'
                                            : 'border-red-200 bg-red-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                        <div className={`p-3 rounded-lg ${colorClasses}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">{device.name}</h4>
                                                {device.current && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                                        Current Device
                                                    </span>
                                                )}
                                                {!device.trusted && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium flex items-center space-x-1">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        <span>Untrusted</span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Monitor className="h-4 w-4" />
                                                    <span>{device.browser} • {device.os}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{device.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{device.lastActive}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        {!device.current && !device.trusted && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleTrustDevice(device.id)}
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                            >
                                                Trust Device
                                            </Button>
                                        )}

                                        {!device.current && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleSignOutDevice(device.id)}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-1" />
                                                Sign Out
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Security Actions */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Security Actions</h3>
                </div>

                <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <LogOut className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-orange-900">Sign Out All Other Devices</h4>
                                    <p className="text-sm text-orange-700 mt-1">
                                        This will sign you out of all devices except this one. Use this if you suspect unauthorized access.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleSignOutAll}
                                className="text-orange-600 border-orange-300 hover:bg-orange-100"
                            >
                                Sign Out All
                            </Button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-blue-900">Security Tips</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li>• Always sign out when using public or shared computers</li>
                            <li>• Regularly review your active sessions</li>
                            <li>• Sign out suspicious or unrecognized devices immediately</li>
                            <li>• Enable two-factor authentication for additional security</li>
                            <li>• Keep your devices updated with the latest software</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Session Statistics */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Session Overview</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{mockDevices.length}</p>
                        <p className="text-sm text-gray-600">Total Sessions</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                            <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                            {mockDevices.filter(d => d.trusted).length}
                        </p>
                        <p className="text-sm text-gray-600">Trusted Devices</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                            {mockDevices.filter(d => d.lastActive.includes('hour') || d.lastActive.includes('now')).length}
                        </p>
                        <p className="text-sm text-gray-600">Recent Activity</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="p-2 bg-red-100 rounded-lg w-fit mx-auto mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                            {mockDevices.filter(d => !d.trusted).length}
                        </p>
                        <p className="text-sm text-gray-600">Untrusted Devices</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevicesSettings;