import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { $cards, cardsActions } from '../../stores/cardsStore';
import { Card } from '../../types';
import Button from '../ui/Button';
import Loading from '../ui/Loading';

const EditCardView: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();
    const navigate = useNavigate();
    const cards = useStore($cards);

    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        website: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        address: '',
        bio: '',
        profileImage: ''
    });

    useEffect(() => {
        if (!cardId) {
            navigate('/cards');
            return;
        }

        const foundCard = cards.find(c => c.id === parseInt(cardId));
        if (foundCard) {
            setCard(foundCard);
            setFormData({
                name: foundCard.name || '',
                title: foundCard.title || '',
                company: foundCard.company || '',
                email: foundCard.email || '',
                phone: foundCard.phone || '',
                website: foundCard.website || '',
                linkedin: foundCard.linkedin || '',
                twitter: foundCard.twitter || '',
                instagram: foundCard.instagram || '',
                address: foundCard.address || '',
                bio: foundCard.bio || '',
                profileImage: foundCard.profileImage || ''
            });
            setLoading(false);
        } else {
            // Card not found in store, try to fetch it
            cardsActions.fetchCard(parseInt(cardId)).then((fetchedCard) => {
                if (fetchedCard) {
                    setCard(fetchedCard);
                    setFormData({
                        name: fetchedCard.name || '',
                        title: fetchedCard.title || '',
                        company: fetchedCard.company || '',
                        email: fetchedCard.email || '',
                        phone: fetchedCard.phone || '',
                        website: fetchedCard.website || '',
                        linkedin: fetchedCard.linkedin || '',
                        twitter: fetchedCard.twitter || '',
                        instagram: fetchedCard.instagram || '',
                        address: fetchedCard.address || '',
                        bio: fetchedCard.bio || '',
                        profileImage: fetchedCard.profileImage || ''
                    });
                } else {
                    navigate('/cards');
                }
                setLoading(false);
            });
        }
    }, [cardId, cards, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!card) return;

        setSaving(true);
        try {
            // Split the name field into firstName and lastName
            const nameParts = formData.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const updateData = {
                firstName,
                lastName,
                title: formData.title,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio,
                photo: formData.profileImage,
                socialMedia: {
                    linkedin: formData.linkedin,
                    twitter: formData.twitter,
                    instagram: formData.instagram
                }
            };

            await cardsActions.updateCard(card.id, updateData);
            navigate('/cards');
        } catch (error) {
            console.error('Failed to update card:', error);
            // You might want to show an error toast here
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        if (card) {
            window.open(`/card/${card.id}`, '_blank');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!card) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">❌</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The card you're trying to edit doesn't exist or you don't have permission to edit it.
                </p>
                <Link
                    to="/cards"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                    Back to My Cards
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
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
                        <h1 className="text-3xl font-bold text-gray-900">Edit Card</h1>
                        <p className="text-gray-600 mt-1">Update your digital business card</p>
                    </div>
                </div>

                <button
                    onClick={handlePreview}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            />
                        </div>

                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                            </label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            placeholder="Tell people about yourself..."
                        />
                    </div>
                </div>

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
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCardView;