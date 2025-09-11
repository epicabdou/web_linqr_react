import React, { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { cardsActions, $cardsLoading, $cardsError, $cards, $isPremium } from '../../stores';
import Button from '../ui/Button';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import Loading from '../ui/Loading';
import { Card } from '../../types';

const CreateCardView: React.FC = () => {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);
    const [previewCard, setPreviewCard] = useState<Card | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loading = useStore($cardsLoading);
    const error = useStore($cardsError);
    const cards = useStore($cards);
    const isPremium = useStore($isPremium);

    // Check if user can create cards
    const canCreate = isPremium ? cards.length < 5 : cards.length < 1;
    if (!canCreate) {
        navigate('/upgrade');
        return null;
    }

    const handleCreateCard = async (cardData: Partial<Card>) => {
        setIsSubmitting(true);
        try {
            const result = await cardsActions.createCard(cardData);
            if (result.success) {
                navigate('/cards');
            } else {
                if (result.error?.includes('limit')) {
                    navigate('/upgrade');
                }
                console.error('Failed to create card:', result.error);
            }
        } catch (error) {
            console.error('Error creating card:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = () => {
        if (previewCard) {
            setShowPreview(true);
        }
    };

    // Use useCallback to prevent infinite re-renders
    const handleFormChange = useCallback((cardData: Partial<Card>) => {
        // Only create preview card if we have essential data
        if (cardData.firstName || cardData.lastName || cardData.email) {
            const mockCard: Card = {
                id: 0, // Temporary ID for preview
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
        } else {
            setPreviewCard(null);
        }
    }, []); // Empty dependency array since we don't depend on any external values

    const handleBackToEdit = () => {
        setShowPreview(false);
    };

    const handleCancel = () => {
        navigate('/cards');
    };

    const handleNavigateBack = () => {
        navigate('/cards');
    };

    if (loading) {
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
                        onClick={handleNavigateBack}
                        icon={ArrowLeft}
                    >
                        Back to Cards
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {showPreview ? 'Preview Your Card' : 'Create New Card'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {showPreview
                                ? 'Review your card before creating it'
                                : 'Fill in your information to create a digital business card'
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {!showPreview && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                icon={X}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePreview}
                                icon={Eye}
                                disabled={!previewCard}
                            >
                                Preview
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Account Limit Info */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blue-900">
                            {isPremium ? 'Premium Account' : 'Free Account'}
                        </h3>
                        <p className="text-sm text-blue-700">
                            {isPremium
                                ? `Creating card ${cards.length + 1} of 5`
                                : `Creating your ${cards.length === 0 ? 'first' : 'only'} card`
                            }
                        </p>
                    </div>
                    {!isPremium && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/upgrade')}
                        >
                            Upgrade for More
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className={showPreview ? 'hidden lg:block' : ''}>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Card Information
                        </h2>
                        <CardForm
                            onSubmit={handleCreateCard}
                            onChange={handleFormChange}
                            isSubmitting={isSubmitting}
                            submitButtonText="Create Card"
                            submitButtonIcon={Save}
                            isPremium={isPremium}
                        />
                    </div>
                </div>

                {/* Preview Section */}
                <div className={showPreview ? '' : 'hidden lg:block'}>
                    <div className="bg-gray-50 rounded-lg p-6 min-h-[600px] flex items-center justify-center">
                        {previewCard ? (
                            <div className="w-full max-w-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                    Live Preview
                                </h3>
                                <CardPreview
                                    card={previewCard}
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
                                            onClick={() => handleCreateCard(previewCard)}
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            icon={Save}
                                            className="flex-1"
                                        >
                                            Create Card
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Fill in your information to see a preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCardView;