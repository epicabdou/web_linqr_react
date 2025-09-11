import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Eye, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../../types';

interface CardFormProps {
    card?: Card | null;
    onSave: (cardData: Partial<Card>) => void;
    onCancel: () => void;
    onPreview?: (cardData: Partial<Card>) => void;
    onChange?: (cardData: Partial<Card>) => void;
    isEditing?: boolean;
    isSubmitting?: boolean;
    showPreviewButton?: boolean;
    isPremium?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({
                                               card,
                                               onSave,
                                               onCancel,
                                               onPreview,
                                               onChange,
                                               isEditing = false,
                                               isSubmitting = false,
                                               showPreviewButton = false,
                                               isPremium = false
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
        template: card?.template || 'classic'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Template definitions with bank card styling
    const templates = [
        // Free templates
        {
            value: 'classic',
            label: 'Classic',
            description: 'Elegant black design',
            free: true,
            preview: 'bg-gradient-to-br from-gray-800 to-black text-white',
            style: 'border-2 border-gray-300 hover:border-blue-500 bg-gradient-to-br from-gray-800 to-black text-white'
        },
        {
            value: 'modern',
            label: 'Modern',
            description: 'Clean blue gradient',
            free: true,
            preview: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
            style: 'border-2 border-gray-300 hover:border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 text-white'
        },
        {
            value: 'minimal',
            label: 'Minimal',
            description: 'Simple white card',
            free: true,
            preview: 'bg-white border-2 border-gray-200 text-gray-800',
            style: 'border-2 border-gray-300 hover:border-blue-500 bg-white text-gray-800'
        },
        // Premium templates
        {
            value: 'gold',
            label: 'Gold Elite',
            description: 'Luxury gold finish',
            free: false,
            preview: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900',
            style: 'border-2 border-yellow-400 hover:border-yellow-500 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900'
        },
        {
            value: 'platinum',
            label: 'Platinum',
            description: 'Premium silver finish',
            free: false,
            preview: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900',
            style: 'border-2 border-gray-400 hover:border-gray-500 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900'
        },
        {
            value: 'neon',
            label: 'Neon',
            description: 'Vibrant cyber design',
            free: false,
            preview: 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white',
            style: 'border-2 border-purple-500 hover:border-pink-500 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white'
        },
        {
            value: 'carbon',
            label: 'Carbon',
            description: 'High-tech carbon fiber',
            free: false,
            preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400',
            style: 'border-2 border-gray-700 hover:border-green-500 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400'
        },
        {
            value: 'rose',
            label: 'Rose Gold',
            description: 'Elegant rose gold',
            free: false,
            preview: 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900',
            style: 'border-2 border-rose-400 hover:border-rose-500 bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900'
        }
    ];

    // Filter templates based on user plan
    const availableTemplates = isPremium ? templates : templates.filter(t => t.free);

    // Update form data when card prop changes (for editing)
    useEffect(() => {
        if (card) {
            const newFormData = {
                firstName: card.firstName || '',
                lastName: card.lastName || '',
                title: card.title || '',
                industry: card.industry || '',
                bio: card.bio || '',
                phone: card.phone || '',
                email: card.email || '',
                address: card.address || '',
                socialMedia: {
                    linkedin: card.socialMedia?.linkedin || '',
                    twitter: card.socialMedia?.twitter || '',
                    instagram: card.socialMedia?.instagram || '',
                    facebook: card.socialMedia?.facebook || '',
                    github: card.socialMedia?.github || '',
                    website: card.socialMedia?.website || ''
                },
                customLinks: card.customLinks || [{ name: '', url: '' }],
                template: card.template || 'classic'
            };
            setFormData(newFormData);
        }
    }, [card]);

    // Notify parent of form changes for real-time preview
    useEffect(() => {
        if (onChange) {
            // Clean up custom links for onChange callback
            const cleanedCustomLinks = formData.customLinks.filter(
                link => link.name.trim() && link.url.trim()
            );

            onChange({
                ...formData,
                customLinks: cleanedCustomLinks
            });
        }
    }, [formData, onChange]);

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
            // Clean up custom links - remove empty ones
            const cleanedCustomLinks = formData.customLinks.filter(
                link => link.name.trim() && link.url.trim()
            );

            onSave({
                ...formData,
                customLinks: cleanedCustomLinks
            });
        }
    };

    const handlePreview = () => {
        if (onPreview && validateForm()) {
            // Clean up custom links for preview
            const cleanedCustomLinks = formData.customLinks.filter(
                link => link.name.trim() && link.url.trim()
            );

            onPreview({
                ...formData,
                customLinks: cleanedCustomLinks
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
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

    const handleTemplateSelect = (templateValue: string) => {
        const template = templates.find(t => t.value === templateValue);
        if (template && (template.free || isPremium)) {
            handleInputChange('template', templateValue);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                error={errors.firstName}
                                required
                                disabled={isSubmitting}
                                fullWidth
                            />
                        </div>
                        <div>
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                error={errors.lastName}
                                required
                                disabled={isSubmitting}
                                fullWidth
                            />
                        </div>
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        required
                        disabled={isSubmitting}
                        fullWidth
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={isSubmitting}
                            fullWidth
                        />
                        <Input
                            label="Industry"
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            disabled={isSubmitting}
                            fullWidth
                        />
                    </div>

                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={isSubmitting}
                        fullWidth
                    />

                    <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={isSubmitting}
                        fullWidth
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            disabled={isSubmitting}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Tell people about yourself..."
                        />
                    </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Social Media</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="LinkedIn"
                            value={formData.socialMedia.linkedin}
                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://linkedin.com/in/username"
                            fullWidth
                        />
                        <Input
                            label="Website"
                            value={formData.socialMedia.website}
                            onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://yourwebsite.com"
                            fullWidth
                        />
                        <Input
                            label="Twitter"
                            value={formData.socialMedia.twitter}
                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://twitter.com/username"
                            fullWidth
                        />
                        <Input
                            label="GitHub"
                            value={formData.socialMedia.github}
                            onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://github.com/username"
                            fullWidth
                        />
                        <Input
                            label="Instagram"
                            value={formData.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://instagram.com/username"
                            fullWidth
                        />
                        <Input
                            label="Facebook"
                            value={formData.socialMedia.facebook}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            disabled={isSubmitting}
                            placeholder="https://facebook.com/username"
                            fullWidth
                        />
                    </div>
                </div>

                {/* Custom Links */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Custom Links</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addCustomLink}
                            icon={Plus}
                            disabled={isSubmitting}
                        >
                            Add Link
                        </Button>
                    </div>

                    {formData.customLinks.map((link, index) => (
                        <div key={index} className="flex space-x-3 items-end">
                            <div className="flex-1">
                                <Input
                                    label="Link Name"
                                    value={link.name}
                                    onChange={(e) => handleCustomLinkChange(index, 'name', e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="e.g., Portfolio"
                                    fullWidth
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    label="URL"
                                    value={link.url}
                                    onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="https://example.com"
                                    fullWidth
                                />
                            </div>
                            {formData.customLinks.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCustomLink(index)}
                                    icon={Trash2}
                                    disabled={isSubmitting}
                                    className="text-red-600 hover:text-red-700"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Card Template</h3>
                        {!isPremium && (
                            <span className="text-sm text-gray-500">
                                Upgrade to Premium for more templates
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableTemplates.map((template) => (
                            <button
                                key={template.value}
                                type="button"
                                onClick={() => handleTemplateSelect(template.value)}
                                disabled={isSubmitting}
                                className={`relative p-4 rounded-xl text-left transition-all transform hover:scale-105 ${
                                    formData.template === template.value
                                        ? `${template.style} ring-4 ring-blue-300 shadow-lg`
                                        : `${template.style} opacity-80 hover:opacity-100 shadow-md hover:shadow-lg`
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">{template.label}</h4>
                                        {formData.template === template.value && (
                                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        )}
                                    </div>
                                    <p className="text-xs opacity-90">{template.description}</p>
                                    <div className="pt-2">
                                        <div className="h-8 rounded border opacity-50 flex items-center px-2">
                                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                            <div className="text-xs">Sample Card</div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}

                        {/* Premium templates for free users (locked) */}
                        {!isPremium && templates.filter(t => !t.free).slice(0, 3).map((template) => (
                            <div
                                key={template.value}
                                className={`relative p-4 rounded-xl text-left ${template.style} opacity-60 cursor-not-allowed`}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <Lock className="h-6 w-6 mx-auto mb-1" />
                                        <div className="text-xs">Premium</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">{template.label}</h4>
                                    </div>
                                    <p className="text-xs opacity-90">{template.description}</p>
                                    <div className="pt-2">
                                        <div className="h-8 rounded border opacity-50 flex items-center px-2">
                                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                            <div className="text-xs">Sample Card</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <div className="flex gap-3 flex-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>

                        {showPreviewButton && onPreview && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreview}
                                disabled={isSubmitting}
                                icon={Eye}
                                className="flex-1 sm:flex-none"
                            >
                                Preview
                            </Button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={Save}
                        className="flex-1 sm:flex-none"
                    >
                        {isEditing ? 'Update Card' : 'Create Card'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CardForm;