import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { Plus, Edit, Eye, Share2, MoreVertical } from 'lucide-react';
import { $cards, cardsActions } from '../stores/cardsStore';
import { Card } from '../types';
import Button from './ui/Button';

const CardsView: React.FC = () => {
    const cards = useStore($cards);
    const navigate = useNavigate();

    const handleEditCard = (cardId: number) => {
        navigate(`/cards/edit/${cardId}`);
    };

    const handleViewCard = (cardId: number) => {
        // For viewing your own card in public mode
        window.open(`/card/${cardId}`, '_blank');
    };

    const handleShareCard = (card: Card) => {
        const shareUrl = `${window.location.origin}/card/${card.id}`;
        const fullName = `${card.firstName || ''} ${card.lastName || ''}`.trim();

        if (navigator.share) {
            navigator.share({
                title: `${fullName} - Digital Business Card`,
                text: `Check out ${fullName}'s digital business card`,
                url: shareUrl,
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            // You might want to show a toast notification here
            alert('Card link copied to clipboard!');
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        if (confirm('Are you sure you want to delete this card?')) {
            await cardsActions.deleteCard(cardId);
        }
    };

    if (cards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Cards Yet</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Create your first digital business card to start sharing your professional information.
                </p>
                <Link
                    to="/cards/create"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                    Create Your First Card
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your digital business cards and track their performance.
                    </p>
                </div>
                <Link
                    to="/cards/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create New Card</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        {/* Card Preview */}
                        <div className="p-6 border-b">
                            <div className="flex items-center space-x-3 mb-4">
                                {card.profileImage ? (
                                    <img
                                        src={card.profileImage}
                                        alt={card.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-500 font-medium">
                                            {card.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{card.name}</h3>
                                    <p className="text-sm text-gray-600">{card.title}</p>
                                </div>
                            </div>

                            {card.company && (
                                <p className="text-sm text-gray-600 mb-2">{card.company}</p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Views: {card.views || 0}</span>
                                <span>•</span>
                                <span>Active</span>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-4 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewCard(card.id)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Card"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleEditCard(card.id)}
                                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit Card"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => handleShareCard(card)}
                                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Share Card"
                                >
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="relative">
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                {/* You can add a dropdown menu here for more actions like delete */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsView;