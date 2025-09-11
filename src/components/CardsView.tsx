import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { Plus, Edit, Eye, Share2, Trash, Check } from 'lucide-react';
import { $cards, $isPremium, cardsActions } from '../stores';
import { Card } from '../types';

const CardsView: React.FC = () => {
    const cards = useStore($cards);
    const isPremium = useStore($isPremium);
    const navigate = useNavigate();
    const [copiedCardId, setCopiedCardId] = useState<number | null>(null);

    const handleEditCard = (cardId: number) => {
        navigate(`/cards/edit/${cardId}`);
    };

    const handleViewCard = (cardId: number) => {
        // For viewing your own card in public mode
        window.open(`/card/${cardId}`, '_blank');
    };

    const handleShareCard = async (card: Card) => {
        const shareUrl = `${window.location.origin}/card/${card.id}`;
        const fullName = `${card.firstName || ''} ${card.lastName || ''}`.trim() || 'Business Card';

        console.log('Attempting to share:', { shareUrl, fullName }); // Debug log

        // Check if Web Share API is available and we're in a secure context
        if (navigator.share && window.isSecureContext) {
            try {
                await navigator.share({
                    title: `${fullName} - Digital Business Card`,
                    text: `Check out ${fullName}'s digital business card`,
                    url: shareUrl,
                });
                console.log('Share successful via Web Share API');
            } catch (err) {
                // User cancelled the share or error occurred
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                    // Fall back to clipboard
                    await copyToClipboard(shareUrl, card.id);
                } else {
                    console.log('Share cancelled by user');
                }
            }
        } else {
            console.log('Web Share API not available, using clipboard fallback');
            await copyToClipboard(shareUrl, card.id);
        }
    };

    const copyToClipboard = async (text: string, cardId: number) => {
        console.log('Attempting to copy to clipboard:', text); // Debug log

        try {
            // Check if we're in a secure context for clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                console.log('Copied via Clipboard API');
                setCopiedCardId(cardId);
                setTimeout(() => setCopiedCardId(null), 2000);
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (err) {
            console.error('Modern clipboard failed:', err);

            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    console.log('Copied via execCommand fallback');
                    setCopiedCardId(cardId);
                    setTimeout(() => setCopiedCardId(null), 2000);
                } else {
                    throw new Error('execCommand copy failed');
                }
            } catch (fallbackErr) {
                console.error('All copy methods failed:', fallbackErr);
                // Show the URL in a prompt as last resort
                prompt('Copy this link to share the card:', text);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        if (confirm('Are you sure you want to delete this card?')) {
            await cardsActions.deleteCard(cardId);
        }
    };

    const getTemplateStyles = (template: string) => {
        switch (template) {
            case 'classic':
                return 'bg-gradient-to-br from-gray-800 to-black text-white';
            case 'modern':
                return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
            case 'minimal':
                return 'bg-white border-2 border-gray-200 text-gray-800';
            case 'gold':
                return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900';
            case 'platinum':
                return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900';
            case 'neon':
                return 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white';
            case 'carbon':
                return 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400';
            case 'rose':
                return 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900';
            default:
                return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
        }
    };

    const canCreateCard = isPremium ? cards.length < 5 : cards.length < 1;

    if (cards.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your digital business cards and track their performance.
                    </p>
                </div>
                {canCreateCard ? (
                    <Link
                        to="/cards/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Card</span>
                    </Link>
                ) : (
                    <Link
                        to="/upgrade"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Upgrade to Create More</span>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className="group relative">
                        {/* Bank Card Style Container */}
                        <div className={`relative w-full h-56 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 ${getTemplateStyles(card.template)}`}>
                            {/* Card Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <defs>
                                        <pattern id={`grid-${card.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100" height="100" fill={`url(#grid-${card.id})`}/>
                                </svg>
                            </div>

                            {/* Card Content */}
                            <div className="relative h-full p-6 flex flex-col justify-between">
                                {/* Top Section */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-lg leading-tight truncate">
                                                {`${card.firstName || ''} ${card.lastName || ''}`.trim() || 'Unnamed Card'}
                                            </h3>
                                            <p className="text-sm opacity-90 truncate">{card.title || 'No title'}</p>
                                        </div>
                                    </div>

                                    {/* Status indicator */}
                                    <div className="flex-shrink-0">
                                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                                    </div>
                                </div>

                                {/* Middle Section */}
                                <div className="flex-1 flex items-center justify-between">
                                    <div className="flex-1">

                                    </div>

                                    {/* QR Code */}
                                    <div className="ml-4">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(`${window.location.origin}/card/${card.id}`)}&bgcolor=ffffff&color=000000&format=png`}
                                            alt="QR Code"
                                            className="w-18 h-18 bg-white/90 rounded p-1"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Bottom Section */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm opacity-75">
                                        <span>{card.scanCount || 0} views</span>
                                        <span>•</span>
                                        <span>Active</span>
                                    </div>

                                    {/* Card chip design element */}
                                    <span className="text-xs opacity-75">LinQR</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Overlay - Modern Design */}
                        <div className="absolute inset-x-4 bottom-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleViewCard(card.id)}
                                        className="p-3 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-all duration-200 border border-white/40 shadow-lg hover:shadow-xl hover:scale-110"
                                        title="View Card"
                                    >
                                        <Eye className="h-4 w-4 text-white drop-shadow-sm" />
                                    </button>

                                    <button
                                        onClick={() => handleEditCard(card.id)}
                                        className="p-3 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-all duration-200 border border-white/40 shadow-lg hover:shadow-xl hover:scale-110"
                                        title="Edit Card"
                                    >
                                        <Edit className="h-4 w-4 text-white drop-shadow-sm" />
                                    </button>

                                    <button
                                        onClick={() => handleShareCard(card)}
                                        className="p-3 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-all duration-200 border border-white/40 shadow-lg hover:shadow-xl hover:scale-110"
                                        title={copiedCardId === card.id ? "Copied!" : "Share Card"}
                                    >
                                        {copiedCardId === card.id ? (
                                            <Check className="h-4 w-4 text-green-300 drop-shadow-sm" />
                                        ) : (
                                            <Share2 className="h-4 w-4 text-white drop-shadow-sm" />
                                        )}
                                    </button>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => handleDeleteCard(card.id)}
                                        className="p-3 bg-red-500/30 backdrop-blur-sm hover:bg-red-500/50 rounded-full transition-all duration-200 border border-red-300/40 shadow-lg hover:shadow-xl hover:scale-110"
                                        title="Delete Card"
                                    >
                                        <Trash className="h-4 w-4 text-white drop-shadow-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Account Limits Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blue-900">
                            {isPremium ? 'Premium Account' : 'Free Account'}
                        </h3>
                        <p className="text-sm text-blue-700">
                            {isPremium
                                ? `${cards.length} of 5 cards used`
                                : `${cards.length} of 1 card used`
                            }
                        </p>
                    </div>
                    {!isPremium && (
                        <Link
                            to="/upgrade"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Upgrade
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardsView;