// AccountSettings.tsx
import React, { useState } from 'react';
import { Trash2, Download, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

interface AccountSettingsProps {
    user: any;
    userProfile: any;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, userProfile }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handleExportData = async () => {
        setIsExporting(true);
        try {
            // Export user data logic
            // This would generate and download a JSON file with all user data
            console.log('Exporting user data...');
        } catch (error) {
            console.error('Error exporting data:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') return;

        try {
            // Delete account logic
            console.log('Deleting account...');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>

            <div className="space-y-8">
                {/* Account Information */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Account ID:</span>
                            <span className="font-mono text-sm">{user?.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Member since:</span>
                            <span>{new Date(userProfile?.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Account type:</span>
                            <span className={userProfile?.is_premium ? 'text-blue-600 font-medium' : ''}>
                                {userProfile?.is_premium ? 'Premium' : 'Free'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Data Export */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
                    <p className="text-gray-600 mb-4">
                        Download a copy of all your data including cards, contacts, and analytics.
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleExportData}
                        disabled={isExporting}
                        loading={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                    </Button>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                                <p className="text-red-700 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Account"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-red-900">This action cannot be undone</h4>
                                <p className="text-red-700 mt-1">
                                    This will permanently delete your account, all your cards, contacts, and analytics data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-bold">DELETE</span> to confirm:
                        </label>
                        <Input
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="DELETE"
                            fullWidth
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== 'DELETE'}
                            className="flex-1"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountSettings;