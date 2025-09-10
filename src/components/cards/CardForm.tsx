import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../../types';

interface CardFormProps {
    card?: Card | null;
    onSave: (cardData: Partial<Card>) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({
                                               card,
                                               onSave,
                                               onCancel,
                                               isEditing = false
                                           }) => {
    const [formData, setFormData] = useState({
        firstName: card?.firstName || '',
        lastName: card?.lastName || '',
        title: card?.title || '',
        industry: card?.industry || '',
        bio: card?.bio || '',
        phone: card?.phone || '',
        email: card?.email || '',
        address: card?.address || '',
        socialMedia: {
            linkedin: card?.socialMedia?.linkedin || '',
            twitter: card?.socialMedia?.twitter || '',
            instagram: card?.socialMedia?.instagram || '',
            facebook: card?.socialMedia?.facebook || '',
            github: card?.socialMedia?.github || '',
            website: card?.socialMedia?.website || ''
        },
        customLinks: card?.customLinks || [{ name: '', url: '' }],
        template: card?.template || 'modern'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSocialMediaChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    const handleCustomLinkChange = (index: number, field: 'name' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            customLinks: prev.customLinks.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const addCustomLink = () => {
        setFormData(prev => ({
            ...prev,
            customLinks: [...prev.customLinks, { name: '', url: '' }]
        }));
    };

    const removeCustomLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customLinks: prev.customLinks.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Card' : 'Create New Card'}
                </h2>
                <Button variant="ghost" onClick={onCancel} icon={X}>
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        error={errors.firstName}
                        required
                        fullWidth
                    />
                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        error={errors.lastName}
                        required
                        fullWidth
                    />
                </div>

                <Input
                    label="Job Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    fullWidth
                />

                <Input
                    label="Industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    fullWidth
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        required
                        fullWidth
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        fullWidth
                    />

                    <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        fullWidth
                    />
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="LinkedIn"
                            type="url"
                            value={formData.socialMedia.linkedin}
                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            fullWidth
                        />

                        <Input
                            label="Twitter"
                            type="url"
                            value={formData.socialMedia.twitter}
                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/username"
                            fullWidth
                        />

                        <Input
                            label="Instagram"
                            type="url"
                            value={formData.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/username"
                            fullWidth
                        />

                        <Input
                            label="GitHub"
                            type="url"
                            value={formData.socialMedia.github}
                            onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                            fullWidth
                        />

                        <Input
                            label="Website"
                            type="url"
                            value={formData.socialMedia.website}
                            onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            fullWidth
                        />
                    </div>
                </div>

                {/* Custom Links */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Custom Links</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addCustomLink}
                            icon={Plus}
                            disabled={formData.customLinks.length >= 5}
                        >
                            Add Link
                        </Button>
                    </div>

                    {formData.customLinks.map((link, index) => (
                        <div key={index} className="flex items-end space-x-2">
                            <Input
                                label="Link Name"
                                value={link.name}
                                onChange={(e) => handleCustomLinkChange(index, 'name', e.target.value)}
                                placeholder="Portfolio, Blog, etc."
                                className="flex-1"
                            />
                            <Input
                                label="URL"
                                type="url"
                                value={link.url}
                                onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1"
                            />
                            {formData.customLinks.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomLink(index)}
                                    icon={Trash2}
                                    className="text-red-600 hover:text-red-700" children={undefined}                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Card Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['modern', 'classic', 'minimal'].map((template) => (
                            <div
                                key={template}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                    formData.template === template
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleInputChange('template', template)}
                            >
                                <div className="text-center">
                                    <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2 opacity-75"></div>
                                    <p className="text-sm font-medium capitalize">{template}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        icon={Save}
                    >
                        {isEditing ? 'Update Card' : 'Create Card'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CardForm;