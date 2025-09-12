import React, { useState } from 'react';
import { Camera, Mail, Phone, Building2, Briefcase, MapPin, Calendar, Upload } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    title: string;
    bio: string;
    location: string;
    website: string;
    avatarUrl?: string;
}

interface ProfileSettingsProps {
    profileData: ProfileData;
    onProfileChange: (data: Partial<ProfileData>) => void;
    onAvatarUpload: (file: File) => void;
    isLoading?: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
                                                             profileData,
                                                             onProfileChange,
                                                             onAvatarUpload,
                                                             isLoading = false
                                                         }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onAvatarUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onAvatarUpload(file);
        }
    };

    return (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {profileData.avatarUrl ? (
                                <img
                                    src={profileData.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                `${profileData.firstName?.[0] || ''}${profileData.lastName?.[0] || ''}` || '?'
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md border-2 border-gray-100">
                            <Camera className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-gray-600 mb-4">
                            Upload a professional photo to personalize your profile and digital cards.
                        </p>

                        <div
                            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                                dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => onProfileChange({ firstName: e.target.value })}
                        placeholder="Your first name"
                        icon={<div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">F</span>
                        </div>}
                        disabled={isLoading}
                    />

                    <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => onProfileChange({ lastName: e.target.value })}
                        placeholder="Your last name"
                        icon={<div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">L</span>
                        </div>}
                        disabled={isLoading}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => onProfileChange({ email: e.target.value })}
                        placeholder="your.email@example.com"
                        icon={Mail}
                        disabled={isLoading}
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => onProfileChange({ phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        icon={Phone}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Professional Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Company"
                        value={profileData.company}
                        onChange={(e) => onProfileChange({ company: e.target.value })}
                        placeholder="Your company name"
                        icon={Building2}
                        disabled={isLoading}
                    />

                    <Input
                        label="Job Title"
                        value={profileData.title}
                        onChange={(e) => onProfileChange({ title: e.target.value })}
                        placeholder="Your job title"
                        icon={Briefcase}
                        disabled={isLoading}
                    />

                    <Input
                        label="Location"
                        value={profileData.location}
                        onChange={(e) => onProfileChange({ location: e.target.value })}
                        placeholder="City, Country"
                        icon={MapPin}
                        disabled={isLoading}
                    />

                    <Input
                        label="Website"
                        value={profileData.website}
                        onChange={(e) => onProfileChange({ website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-3a5 5 0 00-5-5 5 5 0 00-5 5v3m9-9v3a5 5 0 01-5 5 5 5 0 01-5-5v-3" />
                        </svg>}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                </label>
                <textarea
                    value={profileData.bio}
                    onChange={(e) => onProfileChange({ bio: e.target.value })}
                    placeholder="Write a brief description about yourself, your expertise, and what you do..."
                    rows={4}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors disabled:opacity-50"
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                        This will appear on your digital business cards
                    </p>
                    <span className="text-sm text-gray-400">
                        {profileData.bio.length}/500
                    </span>
                </div>
            </div>

            {/* Account Stats */}
            <div className="bg-gray-50 rounded-xl p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                        <p className="text-xs text-gray-600 mt-1">January 2024</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Building2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Cards Created</p>
                        <p className="text-xs text-gray-600 mt-1">3 active cards</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Phone className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Total Connections</p>
                        <p className="text-xs text-gray-600 mt-1">127 contacts</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;