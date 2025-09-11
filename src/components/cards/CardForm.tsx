import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Eye, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../../types';

interface CardFormProps {
    card?: Card | null;
    onSubmit: (cardData: Partial<Card>) => void;
    onChange?: (cardData: Partial<Card>) => void;
    isSubmitting?: boolean;
    submitButtonText?: string;
    submitButtonIcon?: React.ComponentType<any>;
    isPremium?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({
                                               card,
                                               onSubmit,
                                               onChange,
                                               isSubmitting = false,
                                               submitButtonText = 'Save Card',
                                               submitButtonIcon = Save,
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
        customLinks: card?.customLinks || [{ title: '', url: '' }],
        template: card?.template || 'modern'
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

    // Update parent component when form data changes
    useEffect(() => {
        if (onChange) {
            onChange(formData);
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
                link => link.title.trim() && link.url.trim()
            );

            onSubmit({
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

    const handleCustomLinkChange = (index: number, field: 'title' | 'url', value: string) => {
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
            customLinks: [...prev.customLinks, { title: '', url: '' }]
        }));
    };

    const removeCustomLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customLinks: prev.customLinks.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            error={errors.firstName}
                            placeholder="John"
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            error={errors.lastName}
                            placeholder="Doe"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Software Engineer"
                        />
                        <Input
                            label="Industry"
                            value={formData.industry}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                            placeholder="Technology"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Tell people about yourself..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={errors.email}
                            placeholder="john@example.com"
                            required
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>

                    <Input
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main St, City, State 12345"
                    />
                </div>

                {/* Social Media */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="LinkedIn"
                            value={formData.socialMedia.linkedin}
                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                        />
                        <Input
                            label="Twitter"
                            value={formData.socialMedia.twitter}
                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/username"
                        />
                        <Input
                            label="Instagram"
                            value={formData.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/username"
                        />
                        <Input
                            label="GitHub"
                            value={formData.socialMedia.github}
                            onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                        />
                        <Input
                            label="Facebook"
                            value={formData.socialMedia.facebook}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            placeholder="https://facebook.com/username"
                        />
                        <Input
                            label="Website"
                            value={formData.socialMedia.website}
                            onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                </div>

                {/* Custom Links */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Custom Links</h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addCustomLink}
                            icon={Plus}
                            size="sm"
                        >
                            Add Link
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.customLinks.map((link, index) => (
                            <div key={index} className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Input
                                        label="Link Title"
                                        value={link.title}
                                        onChange={(e) => handleCustomLinkChange(index, 'title', e.target.value)}
                                        placeholder="My Portfolio"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="URL"
                                        value={link.url}
                                        onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                                        placeholder="https://myportfolio.com"
                                    />
                                </div>
                                {formData.customLinks.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => removeCustomLink(index)}
                                        icon={Trash2}
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Card Template</h3>
                        {!isPremium && (
                            <span className="text-sm text-gray-500">
                                Upgrade for premium templates
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {availableTemplates.map((template) => (
                            <div
                                key={template.value}
                                className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${
                                    formData.template === template.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleInputChange('template', template.value)}
                            >
                                {/* Premium badge */}
                                {!template.free && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                        {isPremium ? '✓' : <Lock className="h-3 w-3" />}
                                    </div>
                                )}

                                {/* Template preview */}
                                <div className={`h-16 rounded ${template.preview} mb-2 flex items-center justify-center text-xs font-semibold`}>
                                    {template.label}
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-900">{template.label}</p>
                                    <p className="text-xs text-gray-500">{template.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={submitButtonIcon}
                        className="px-8"
                    >
                        {submitButtonText}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CardForm;