// SecuritySettings.tsx
import React, { useState } from 'react';
import { Lock, Shield, Key, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SecuritySettings: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async () => {
        setIsChangingPassword(true);
        try {
            // Password change logic
            console.log('Changing password...');
        } catch (error) {
            console.error('Error changing password:', error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

            <div className="space-y-8">
                {/* Change Password */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                        <div className="relative">
                            <Input
                                label="Current Password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                icon={Lock}
                                fullWidth
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                icon={Key}
                                fullWidth
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm New Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                icon={Key}
                                fullWidth
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <Button
                            onClick={handlePasswordChange}
                            disabled={!passwordData.currentPassword || !passwordData.newPassword ||
                                passwordData.newPassword !== passwordData.confirmPassword}
                            loading={isChangingPassword}
                        >
                            Update Password
                        </Button>
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Shield className="h-6 w-6 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Two-factor authentication is not enabled</p>
                                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Enable 2FA
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="border-t pt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Security Activity</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600">No recent security events to display.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;