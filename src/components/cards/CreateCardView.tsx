import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { cardsActions, $loading, $error } from '../../stores/cardsStore';
import { $isPremium } from '../../stores/authStore';
import Button from '../ui/Button';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import Loading from '../ui/Loading';
import { Card } from '../../types';

interface CreateCardViewProps {
    setCurrentView: (view: string) => void;
}

const CreateCardView: React.FC<CreateCardViewProps> = ({ setCurrentView }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [previewCard, setPreviewCard] = useState<Partial<Card> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loading = useStore($loading);
    const error = useStore($error);
    const isPremium = useStore($isPremium);

    const handleSaveCard = async (cardData: Partial<Card>) => {
        try {
            setIsSubmitting(true);
            cardsActions.clearError();

            // Validate required fields
            if (!cardData.firstName || !cardData.lastName || !cardData.email) {
                throw new Error('First name, last name, and email are required');
            }

            // Check premium limits
            // This should be handled in the store, but adding extra validation
            const result = await cardsActions.createCard(cardData);

            if (result.success) {
                // Success! Redirect to cards view
                setCurrentView('cards');
            } else {
                // Error handled by store
                console.error('Failed to create card:', result.error);
            }
        } catch (err) {
            console.error('Card creation error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = (cardData: Partial<Card>) => {
        // Create a preview card with mock ID for preview
        const mockCard: Card = {
            id: 999, // Mock ID for preview
            firstName: cardData.firstName || '',
            lastName: cardData.lastName || '',
            title: cardData.title || '',
            industry: cardData.industry || '',
            bio: cardData.bio || '',
            photo: cardData.photo || null,
            phone: cardData.phone || '',
            email: cardData.email || '',
            address: cardData.address || '',
            socialMedia: cardData.socialMedia || {},
            customLinks: cardData.customLinks || [],
            template: cardData.template || 'modern',
            isActive: true,
            scanCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setPreviewCard(mockCard);
        setShowPreview(true);
    };

    const handleBackToEdit = () => {
        setShowPreview(false);
        setPreviewCard(null);
    };

    if (loading && !isSubmitting) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Loading centered text="Loading..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentView('cards')}
                        icon={ArrowLeft}
                    >
                        Back to Cards
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {showPreview ? 'Preview Card' : 'Create New Card'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {showPreview
                                ? 'Review your card before saving'
                                : 'Build your digital business card'
                            }
                        </p>
                    </div>
                </div>

                {/* Preview Toggle */}
                {!showPreview && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            // We'll trigger preview from the form
                        }}
                        icon={Eye}
                        disabled={!previewCard}
                    >
                        Preview
                    </Button>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{error}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={cardsActions.clearError}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className={showPreview ? 'hidden lg:block' : ''}>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Card Information</h2>
                        <CardForm
                            onSave={handleSaveCard}
                            onCancel={() => setCurrentView('cards')}
                            onPreview={handlePreview}
                            isSubmitting={isSubmitting}
                            showPreviewButton={true}
                        />
                    </div>
                </div>

                {/* Preview Section */}
                <div className={!showPreview ? 'hidden lg:block' : ''}>
                    <div className="bg-gray-50 rounded-lg p-6 min-h-[600px] flex items-center justify-center">
                        {previewCard ? (
                            <div className="w-full max-w-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                    Live Preview
                                </h3>
                                <CardPreview
                                    card={previewCard}
                                    setCurrentView={() => {}}
                                    setSelectedCard={() => {}}
                                    isPreview={true}
                                />

                                {showPreview && (
                                    <div className="mt-6 flex space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleBackToEdit}
                                            className="flex-1"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleSaveCard(previewCard)}
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            icon={Save}
                                            className="flex-1"
                                        >
                                            Save Card
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Eye className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Your Card</h3>
                                <p className="text-gray-500">
                                    Fill out the form to see a live preview of your digital business card
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Preview Mode */}
            {showPreview && (
                <div className="lg:hidden mt-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Card Preview</h2>
                            <Button
                                variant="outline"
                                onClick={handleBackToEdit}
                                icon={ArrowLeft}
                                size="sm"
                            >
                                Edit
                            </Button>
                        </div>

                        {previewCard && (
                            <div className="max-w-sm mx-auto">
                                <CardPreview
                                    card={previewCard}
                                    setCurrentView={() => {}}
                                    setSelectedCard={() => {}}
                                    isPreview={true}
                                />

                                <div className="mt-6">
                                    <Button
                                        onClick={() => handleSaveCard(previewCard)}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        icon={Save}
                                        fullWidth
                                    >
                                        Save Card
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCardView;