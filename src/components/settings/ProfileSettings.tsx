// components/settings/ProfileSettings.tsx
import React, { useState, useRef } from 'react';
import { User, Camera, Save, X, Upload, Trash2 } from 'lucide-react';
import { useStore } from '@nanostores/react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import { settingsActions, $settingsLoading, $settingsError } from '../../stores/settingsStore';
import { $user } from '../../stores/authStore';
import { uploadAvatar, validateAvatarFile, resizeImage, createPreviewUrl, cleanupPreviewUrl } from '../../utils/avatarUpload';

interface ProfileSettingsProps {
    user: any;
    userProfile: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, userProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: userProfile?.first_name || '',
        lastName: userProfile?.last_name || '',
        email: user?.email || '',
        avatarUrl: userProfile?.avatar_url || ''
    });

    const settingsLoading = useStore($settingsLoading);
    const settingsError = useStore($settingsError);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            let avatarUrl = formData.avatarUrl;

            // Upload new avatar if selected
            if (avatarFile) {
                // Resize image before upload
                const resizedFile = await resizeImage(avatarFile, 400, 400, 0.8);
                const uploadResult = await uploadAvatar(resizedFile, user.id);

                if (uploadResult.success && uploadResult.url) {
                    avatarUrl = uploadResult.url;
                } else {
                    throw new Error(uploadResult.error || 'Failed to upload avatar');
                }
            }

            // Update profile
            const result = await settingsActions.updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                avatarUrl
            });

            if (result.success) {
                setIsEditing(false);
                setAvatarFile(null);
                if (avatarPreview) {
                    cleanupPreviewUrl(avatarPreview);
                    setAvatarPreview(null);
                }
                // Update form data with new avatar URL
                setFormData(prev => ({ ...prev, avatarUrl }));
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Error is handled by the store
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: userProfile?.first_name || '',
            lastName: userProfile?.last_name || '',
            email: user?.email || '',
            avatarUrl: userProfile?.avatar_url || ''
        });
        setIsEditing(false);
        setAvatarFile(null);
        if (avatarPreview) {
            cleanupPreviewUrl(avatarPreview);
            setAvatarPreview(null);
        }
        settingsActions.clearError();
    };

    const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validateAvatarFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        // Clean up previous preview
        if (avatarPreview) {
            cleanupPreviewUrl(avatarPreview);
        }

        // Set new file and preview
        setAvatarFile(file);
        const previewUrl = createPreviewUrl(file);
        setAvatarPreview(previewUrl);
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        if (avatarPreview) {
            cleanupPreviewUrl(avatarPreview);
            setAvatarPreview(null);
        }
        setFormData(prev => ({ ...prev, avatarUrl: '' }));
    };

    const currentAvatarUrl = avatarPreview || formData.avatarUrl;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                        </Button>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {settingsError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="text-red-600">
                            <X className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-red-900">Error</h4>
                            <p className="text-red-700 mt-1">{settingsError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {currentAvatarUrl ? (
                            <img
                                src={currentAvatarUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-8 w-8 text-gray-400" />
                        )}
                    </div>

                    {isEditing && (
                        <div className="absolute -bottom-1 -right-1 flex space-x-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-md"
                                title="Upload photo"
                            >
                                <Camera className="h-3 w-3" />
                            </button>
                            {currentAvatarUrl && (
                                <button
                                    onClick={handleRemoveAvatar}
                                    className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors shadow-md"
                                    title="Remove photo"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarSelect}
                        className="hidden"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {formData.firstName || formData.lastName
                            ? `${formData.firstName} ${formData.lastName}`.trim()
                            : 'Your Name'
                        }
                    </h3>
                    <p className="text-gray-600">{formData.email}</p>
                    {isEditing && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Click the camera icon to upload a new photo
                            </p>
                            <p className="text-xs text-gray-400">
                                Supported: JPEG, PNG, WebP, GIF (Max 5MB)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        fullWidth
                        placeholder="Enter your first name"
                    />
                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        fullWidth
                        placeholder="Enter your last name"
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={true} // Email changes should go through security settings
                    fullWidth
                    helperText="To change your email, please use the Security settings"
                />

                {/* Profile Stats */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {userProfile?.cards_count || 0}
                            </p>
                            <p className="text-sm text-gray-600">Digital Cards</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {userProfile?.total_scans || 0}
                            </p>
                            <p className="text-sm text-gray-600">Total Scans</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {userProfile?.contacts_count || 0}
                            </p>
                            <p className="text-sm text-gray-600">Contacts</p>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Member since:</span>
                            <span className="font-medium">
                                {userProfile?.created_at
                                    ? new Date(userProfile.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'N/A'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Account type:</span>
                            <span className={`font-medium ${userProfile?.is_premium ? 'text-blue-600' : 'text-gray-600'}`}>
                                {userProfile?.is_premium ? 'Premium' : 'Free'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last updated:</span>
                            <span className="font-medium">
                                {userProfile?.updated_at
                                    ? new Date(userProfile.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : 'N/A'
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;