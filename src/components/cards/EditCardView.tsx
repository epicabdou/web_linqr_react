import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { cardsActions, $cardsLoading, $cardsError, $cards, $isPremium } from '../../stores';
import Button from '../ui/Button';
import CardForm from './CardForm';
import CardPreview from './CardPreview';
import Loading from '../ui/Loading';
import Modal from '../ui/Modal';
import { Card } from '../../types';

const EditCardView: React.FC = () => {
    const navigate = useNavigate();
    const { cardId } = useParams<{ cardId: string }>();
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewCard, setPreviewCard] = useState<Card | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentFormData, setCurrentFormData] = useState<Partial<Card> | null>(null);
    const [isLoadingCard, setIsLoadingCard] = useState(true);

    const loading = useStore($cardsLoading);
    const error = useStore($cardsError);
    const cards = useStore($cards);
    const isPremium = useStore($isPremium);

    // Find and set the selected card when cards are loaded or cardId changes
    useEffect(() => {
        if (cardId && cards.length > 0) {
            const card = cards.find(c => c.id === parseInt(cardId));
            if (card) {
                setSelectedCard(card);
                setIsLoadingCard(false);
            } else {
                // Card not found in current cards, try to fetch it
                loadCard();
            }
        } else if (cardId && cards.length === 0) {
            // Cards not loaded yet, try to fetch them first
            cardsActions.fetchCards();
        }
    }, [cardId, cards]);

    const loadCard = async () => {
        if (!cardId || isNaN(parseInt(cardId))) {
            navigate('/cards');
            return;
        }

        setIsLoadingCard(true);
        try {
            const result = await cardsActions.getCard(parseInt(cardId));
            if (result.success && result.data) {
                setSelectedCard(result.data);
            } else {
                console.error('Failed to load card:', result.error);
                navigate('/cards');
            }
        } catch (error) {
            console.error('Error loading card:', error);
            navigate('/cards');
        } finally {
            setIsLoadingCard(false);
        }
    };

    // Auto-update preview when form data changes
    useEffect(() => {
        if (currentFormData && selectedCard) {
            const mockCard: Card = {
                ...selectedCard,
                firstName: currentFormData.firstName || selectedCard.firstName,
                lastName: currentFormData.lastName || selectedCard.lastName,
                title: currentFormData.title || selectedCard.title,
                industry: currentFormData.industry || selectedCard.industry,
                bio: currentFormData.bio || selectedCard.bio,
                photo: currentFormData.photo || selectedCard.photo,
                phone: currentFormData.phone || selectedCard.phone,
                email: currentFormData.email || selectedCard.email,
                address: currentFormData.address || selectedCard.address,
                socialMedia: currentFormData.socialMedia || selectedCard.socialMedia,
                customLinks: currentFormData.customLinks || selectedCard.customLinks,
                template: currentFormData.template || selectedCard.template
            };

            setPreviewCard(mockCard);
        }
    }, [currentFormData, selectedCard]);

    const handleUpdateCard = async (cardData: Partial<Card>) => {
        if (!selectedCard) return;

        setIsSubmitting(true);
        try {
            const result = await cardsActions.updateCard(selectedCard.id, cardData);
            if (result.success) {
                navigate('/cards');
            } else {
                console.error('Failed to update card:', result.error);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCard = async () => {
        if (!selectedCard) return;

        setIsDeleting(true);
        try {
            const result = await cardsActions.deleteCard(selectedCard.id);
            if (result.success) {
                navigate('/cards');
            } else {
                console.error('Failed to delete card:', result.error);
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handlePreview = () => {
        if (currentFormData && selectedCard) {
            const mockCard: Card = {
                ...selectedCard,
                ...currentFormData
            };
            setPreviewCard(mockCard);
            setShowPreview(true);
        }
    };

    const handleFormChange = (cardData: Partial<Card>) => {
        setCurrentFormData(cardData);
    };

    const handleBackToEdit = () => {
        setShowPreview(false);
    };

    const handleNavigateBack = () => {
        navigate('/cards');
    };

    if (isLoadingCard || loading) {
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
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        The card you're trying to edit doesn't exist or you don't have permission to edit it.
                    </p>
                    <Button
                        onClick={handleNavigateBack}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
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
                        onClick={handleNavigateBack}
                        icon={ArrowLeft}
                    >
                        Back to Cards
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {showPreview ? 'Preview Changes' : 'Edit Card'}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {showPreview
                                ? 'Review your changes before saving'
                                : `Editing ${selectedCard.firstName} ${selectedCard.lastName}'s card`
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {!showPreview && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handlePreview}
                                icon={Eye}
                                disabled={!currentFormData}
                            >
                                Preview
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(true)}
                                icon={Trash2}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Delete
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className={showPreview ? 'hidden lg:block' : ''}>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Card Information
                        </h2>
                        <CardForm
                            card={selectedCard}
                            onSubmit={handleUpdateCard}
                            onChange={handleFormChange}
                            isSubmitting={isSubmitting}
                            submitButtonText="Update Card"
                            submitButtonIcon={Save}
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
                            <div className="text-center text-gray-500">
                                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Make changes to see a live preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Card"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete "{selectedCard.firstName} {selectedCard.lastName}"?
                        This action cannot be undone and all analytics data will be lost.
                    </p>
                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteCard}
                            loading={isDeleting}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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