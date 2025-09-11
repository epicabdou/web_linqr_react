import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { ArrowLeft, Save, Eye, Lock } from 'lucide-react';
import { cardsActions } from '../../stores/cardsStore';
import { $isPremium } from '../../stores/authStore';
import CardPreview from './CardPreview';

const CreateCardView: React.FC = () => {
    const navigate = useNavigate();
    const isPremium = useStore($isPremium);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        title: '',
        industry: '',
        email: '',
        phone: '',
        address: '',
        bio: '',
        photo: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        template: 'modern'
    });

    // Banking-style templates with enhanced styling
    const templates = [
        // Free templates (3 available)
        {
            value: 'classic',
            label: 'Classic',
            description: 'Elegant black design',
            free: true,
            preview: 'bg-gradient-to-br from-gray-800 to-black text-white',
            style: 'border-2 border-gray-300 hover:border-gray-600 bg-gradient-to-br from-gray-800 to-black text-white shadow-lg'
        },
        {
            value: 'modern',
            label: 'Modern',
            description: 'Clean blue gradient',
            free: true,
            preview: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
            style: 'border-2 border-gray-300 hover:border-blue-500 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg'
        },
        {
            value: 'minimal',
            label: 'Minimal',
            description: 'Simple white card',
            free: true,
            preview: 'bg-white border-2 border-gray-200 text-gray-800',
            style: 'border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-800 shadow-lg'
        },
        // Premium templates
        {
            value: 'gold',
            label: 'Gold Elite',
            description: 'Luxury gold finish',
            free: false,
            preview: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900',
            style: 'border-2 border-yellow-400 hover:border-yellow-500 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 shadow-xl'
        },
        {
            value: 'platinum',
            label: 'Platinum',
            description: 'Premium silver finish',
            free: false,
            preview: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900',
            style: 'border-2 border-gray-400 hover:border-gray-500 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow-xl'
        },
        {
            value: 'neon',
            label: 'Neon',
            description: 'Vibrant rainbow design',
            free: false,
            preview: 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white',
            style: 'border-2 border-purple-400 hover:border-pink-500 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white shadow-xl'
        },
        {
            value: 'carbon',
            label: 'Carbon',
            description: 'Tech-inspired dark theme',
            free: false,
            preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400',
            style: 'border-2 border-green-400 hover:border-green-500 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400 shadow-xl'
        },
        {
            value: 'rose',
            label: 'Rose Gold',
            description: 'Elegant rose gold design',
            free: false,
            preview: 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900',
            style: 'border-2 border-rose-400 hover:border-rose-500 bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900 shadow-xl'
        }
    ];

    const availableTemplates = isPremium ? templates : templates.filter(t => t.free);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTemplateSelect = (template: string) => {
        setFormData(prev => ({
            ...prev,
            template
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const cardData = {
                ...formData,
                socialMedia: {
                    linkedin: formData.linkedin,
                    twitter: formData.twitter,
                    instagram: formData.instagram
                }
            };

            const newCard = await cardsActions.createCard(cardData);
            navigate('/cards');
        } catch (error) {
            console.error('Failed to create card:', error);
            // You might want to show an error toast here
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        setShowPreview(!showPreview);
    };

    // Create preview card for real-time preview
    const previewCard = {
        id: 999, // Mock ID for preview
        firstName: formData.firstName || 'John',
        lastName: formData.lastName || 'Doe',
        title: formData.title || 'Your Title',
        industry: formData.industry || '',
        bio: formData.bio || '',
        photo: formData.photo || null,
        phone: formData.phone || '',
        email: formData.email || 'email@example.com',
        address: formData.address || '',
        socialMedia: {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            instagram: formData.instagram
        },
        customLinks: [],
        template: formData.template,
        isActive: true,
        scanCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/cards"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Card</h1>
                        <p className="text-gray-600 mt-1">Build your digital business card</p>
                    </div>
                </div>

                <button
                    onClick={handlePreview}
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
                >
                    <Eye className="h-4 w-4" />
                    <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your first name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your last name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry
                                    </label>
                                    <input
                                        type="text"
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your industry"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tell people about yourself and what you do..."
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedin"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Twitter
                                    </label>
                                    <input
                                        type="url"
                                        id="twitter"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://twitter.com/username"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                                        Instagram
                                    </label>
                                    <input
                                        type="url"
                                        id="instagram"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://instagram.com/username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Template Selection */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Card Template</h2>
                                {!isPremium && (
                                    <span className="text-sm text-gray-500">
                                        3 templates free • <Link to="/upgrade" className="text-blue-600 hover:text-blue-700">Upgrade for more</Link>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableTemplates.map((template) => (
                                    <button
                                        key={template.value}
                                        type="button"
                                        onClick={() => handleTemplateSelect(template.value)}
                                        disabled={saving}
                                        className={`relative p-4 rounded-xl text-left transition-all transform hover:scale-105 ${
                                            formData.template === template.value
                                                ? `${template.style} ring-4 ring-blue-300 shadow-2xl scale-105`
                                                : `${template.style} opacity-80 hover:opacity-100 shadow-lg hover:shadow-xl`
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm">{template.label}</h4>
                                                {formData.template === template.value && (
                                                    <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                                                )}
                                            </div>
                                            <p className="text-xs opacity-90 font-medium">{template.description}</p>
                                            <div className="pt-2">
                                                <div className="h-8 rounded border opacity-60 flex items-center px-2">
                                                    <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                                    <div className="text-xs font-semibold">Sample Card</div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {/* Premium templates for free users (locked) */}
                                {!isPremium && templates.filter(t => !t.free).slice(0, 3).map((template) => (
                                    <div
                                        key={template.value}
                                        className={`relative p-4 rounded-xl text-left ${template.style} opacity-40 cursor-not-allowed`}
                                    >
                                        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                                            <div className="text-center">
                                                <Lock className="h-6 w-6 mx-auto mb-1 text-white" />
                                                <span className="text-xs text-white font-semibold">Premium</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm">{template.label}</h4>
                                            </div>
                                            <p className="text-xs opacity-90 font-medium">{template.description}</p>
                                            <div className="pt-2">
                                                <div className="h-8 rounded border opacity-60 flex items-center px-2">
                                                    <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                                                    <div className="text-xs font-semibold">Sample Card</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-between pt-6">
                            <Link
                                to="/cards"
                                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving || !formData.firstName || !formData.lastName || !formData.email}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Create Card</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Real-time Preview */}
                <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
                    <div className="sticky top-8">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                            <CardPreview card={previewCard} isPreview={true} />
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    This is how your card will look. Changes update automatically!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCardView;