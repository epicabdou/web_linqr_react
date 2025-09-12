import React, { useState } from 'react';
import {
    Shield,
    Eye,
    EyeOff,
    Lock,
    Key,
    Trash2,
    Download,
    Globe,
    Users,
    AlertTriangle
} from 'lucide-react';
import Button from '../ui/Button';

const PrivacySettings: React.FC = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [publicProfile, setPublicProfile] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [dataProcessing, setDataProcessing] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const ToggleSwitch: React.FC<{
        checked: boolean;
        onChange: (checked: boolean) => void;
        disabled?: boolean;
    }> = ({ checked, onChange, disabled = false }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
        </label>
    );

    const handleChangePassword = () => {
        // Implement password change logic
        console.log('Change password clicked');
    };

    const handleEnable2FA = () => {
        // Implement 2FA setup logic
        setTwoFactorEnabled(!twoFactorEnabled);
        console.log('2FA toggled:', !twoFactorEnabled);
    };

    const handleDownloadData = () => {
        // Implement data export logic
        console.log('Download data clicked');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        // Implement account deletion logic
        console.log('Account deletion confirmed');
        setShowDeleteModal(false);
    };

    return (
        <div className="space-y-8">
            {/* Account Security */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                </div>

                <div className="space-y-4">
                    {/* Password */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Lock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Password</h4>
                                <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword}>
                            Change Password
                        </Button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <Key className={`h-5 w-5 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                    {twoFactorEnabled && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            Enabled
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {twoFactorEnabled
                                        ? 'Your account is protected with 2FA'
                                        : 'Add an extra layer of security to your account'
                                    }
                                </p>
                            </div>
                        </div>
                        <Button
                            variant={twoFactorEnabled ? "outline" : "default"}
                            onClick={handleEnable2FA}
                        >
                            {twoFactorEnabled ? 'Disable' : 'Enable'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Profile Privacy */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Profile Privacy</h3>
                </div>

                <div className="space-y-4">
                    {/* Public Profile */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Globe className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Public Profile</h4>
                                <p className="text-sm text-gray-600">Allow others to find and view your profile</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={publicProfile}
                            onChange={setPublicProfile}
                        />
                    </div>

                    {/* Email Visibility */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                {showEmail ? (
                                    <Eye className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Show Email on Cards</h4>
                                <p className="text-sm text-gray-600">Display your email address on digital business cards</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={showEmail}
                            onChange={setShowEmail}
                        />
                    </div>

                    {/* Phone Visibility */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                {showPhone ? (
                                    <Eye className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Show Phone on Cards</h4>
                                <p className="text-sm text-gray-600">Display your phone number on digital business cards</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={showPhone}
                            onChange={setShowPhone}
                        />
                    </div>
                </div>
            </div>

            {/* Data & Privacy */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Data & Privacy</h3>
                </div>

                <div className="space-y-4">
                    {/* Data Processing */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Analytics Processing</h4>
                                <p className="text-sm text-gray-600">Allow us to process your data for analytics insights</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={dataProcessing}
                            onChange={setDataProcessing}
                        />
                    </div>

                    {/* Download Data */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Download className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-900">Download Your Data</h4>
                                <p className="text-sm text-blue-700">Get a copy of all your data in LinQR</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleDownloadData}>
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-red-900">Delete Account</h4>
                                <p className="text-sm text-red-700 mt-1">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleDeleteAccount}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This will permanently remove:
                        </p>

                        <ul className="text-sm text-gray-600 mb-6 space-y-1">
                            <li>• All your digital business cards</li>
                            <li>• Your contact database</li>
                            <li>• Analytics and scan history</li>
                            <li>• Account settings and preferences</li>
                        </ul>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> This action is irreversible. Consider downloading your data first.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDeleteAccount}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacySettings;