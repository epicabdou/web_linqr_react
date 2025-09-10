import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { cardsActions, $loading, $error, $selectedCard } from '../../stores/cardsStore';
import Button from '../ui/Button';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import Loading from '../ui/Loading';
import Modal from '../ui/Modal';
import { Card } from '../../types';

interface EditCardViewProps {
    setCurrentView: (view: string) => void;
}

const EditCardView: React.FC<EditCardViewProps> = ({ setCurrentView }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [previewCard, setPreviewCard] = useState<Card | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loading = useStore($loading);
    const error = useStore($error);
    const selectedCard = useStore($selectedCard);

    // Redirect if no card is selected
    useEffect(() => {
        if (!loading && !selectedCard) {
            setCurrentView('cards');
        }
    }, [loading, selectedCard, setCurrentView]);

    const handleUpdateCard = async (cardData: Partial<Card>) => {
        if (!selectedCard) return;

        try {
            setIsSubmitting(true);
            cardsActions.clearError();

            // Validate required fields
            if (!cardData.firstName || !cardData.lastName || !cardData.email) {
                throw new Error('First name, last name, and email are required');
            }

            const result = await cardsActions.updateCard(selectedCard.id, cardData);

            if (result.success) {
                // Success! Redirect to cards view
                setCurrentView('cards');
            } else {
                // Error handled by store
                console.error('Failed to update card:', result.error);
            }
        } catch (err) {
            console.error('Card update error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCard = async () => {
        if (!selectedCard) return;

        try {
            setIsDeleting(true);
            cardsActions.clearError();

            const result = await cardsActions.deleteCard(selectedCard.id);

            if (result.success) {
                // Success! Redirect to cards view
                setShowDeleteModal(false);
                setCurrentView('cards');
            } else {
                // Error handled by store
                console.error('Failed to delete card:', result.error);
            }
        } catch (err) {
            console.error('Card deletion error:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePreview = (cardData: Partial<Card>) => {
        if (!selectedCard) return;

        // Create a preview card with updated data
        const mockCard: Card = {
            ...selectedCard,
            firstName: cardData.firstName || selectedCard.firstName,
            lastName: cardData.lastName || selectedCard.lastName,
            title: cardData.title || selectedCard.title,
            industry: cardData.industry || selectedCard.industry,
            bio: cardData.bio || selectedCard.bio,
            photo: cardData.photo || selectedCard.photo,
            phone: cardData.phone || selectedCard.phone,
            email: cardData.email || selectedCard.email,
            address: cardData.address || selectedCard.address,
            socialMedia: cardData.socialMedia || selectedCard.socialMedia,
            customLinks: cardData.customLinks || selectedCard.customLinks,
            template: cardData.template || selectedCard.template
        };

        setPreviewCard(mockCard);
        setShowPreview(true);
    };

    const handleBackToEdit = () => {
        setShowPreview(false);
        setPreviewCard(null);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Loading centered text="Loading card..." />
            </div>
        );
    }

    if (!selectedCard) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-500">Card not found</p>
                    <Button
                        onClick={() => setCurrentView('cards')}
                        className="mt-4"
                    >
                        Back to Cards
                    </Button>
                </div>
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
                            {showPreview ? 'Preview Card' : 'Edit Card'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {showPreview
                                ? 'Review your changes before saving'
                                : `Editing ${selectedCard.firstName} ${selectedCard.lastName}'s card`
                            }
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {!showPreview && (
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(true)}
                            icon={Trash2}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                            Delete
                        </Button>
                    )}
                </div>
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
                            card={selectedCard}
                            onSave={handleUpdateCard}
                            onCancel={() => setCurrentView('cards')}
                            onPreview={handlePreview}
                            isEditing={true}
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
                                            onClick={() => handleUpdateCard(previewCard)}
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            icon={Save}
                                            className="flex-1"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <Eye className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Your Changes</h3>
                                <p className="text-gray-500">
                                    Make changes to see a live preview of your updated card
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
                                        onClick={() => handleUpdateCard(previewCard)}
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        icon={Save}
                                        fullWidth
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Card"
                size="sm"
            >
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this card?</h3>
                    <p className="text-gray-600 mb-6">
                        This action cannot be undone. The card and all its analytics data will be permanently deleted.
                    </p>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteCard}
                            loading={isDeleting}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Delete Card
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditCardView;