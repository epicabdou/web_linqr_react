import React from 'react';
import { Plus, Eye, Edit, Share2, Trash, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../types';
import Button from '../ui/Button';

interface DashboardCardsGridProps {
    cards: Card[];
    copiedCardId: number | null;
    onViewCard: (cardId: number) => void;
    onEditCard: (cardId: number) => void;
    onShareCard: (card: Card) => void;
    onDeleteCard: (cardId: number) => void;
    canCreateCard: boolean;
    isPremium: boolean;
}

const DashboardCardsGrid: React.FC<DashboardCardsGridProps> = ({
                                                                   cards,
                                                                   copiedCardId,
                                                                   onViewCard,
                                                                   onEditCard,
                                                                   onShareCard,
                                                                   onDeleteCard,
                                                                   canCreateCard,
                                                                   isPremium
                                                               }) => {
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

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Cards</h2>
                <Button
                    as={canCreateCard ? Link : 'button'}
                    to={canCreateCard ? "/cards/create" : undefined}
                    onClick={canCreateCard ? undefined : () => window.location.href = '/upgrade'}
                    icon={Plus}
                    disabled={!canCreateCard}
                >
                    {canCreateCard ? 'Create New Card' : (isPremium ? 'Card Limit Reached' : 'Upgrade to Create')}
                </Button>
            </div>

            {cards.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">📱</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cards Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Create your first digital business card to start networking
                    </p>
                    <Button
                        as={Link}
                        to="/cards/create"
                        icon={Plus}
                    >
                        Create Your First Card
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="group relative">
                            <div className={`relative h-56 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${getTemplateStyles(card.template || 'modern')}`}>
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
                                        <div className="flex-1"></div>

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
                                        <span className="text-xs opacity-75">LinQR</span>
                                    </div>
                                </div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute inset-x-4 bottom-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => onViewCard(card.id)}
                                                className="p-3 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-all duration-200 border border-white/40 shadow-lg hover:shadow-xl hover:scale-110"
                                                title="View Card"
                                            >
                                                <Eye className="h-4 w-4 text-white drop-shadow-sm" />
                                            </button>

                                            <button
                                                onClick={() => onEditCard(card.id)}
                                                className="p-3 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-all duration-200 border border-white/40 shadow-lg hover:shadow-xl hover:scale-110"
                                                title="Edit Card"
                                            >
                                                <Edit className="h-4 w-4 text-white drop-shadow-sm" />
                                            </button>

                                            <button
                                                onClick={() => onShareCard(card)}
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
                                                onClick={() => onDeleteCard(card.id)}
                                                className="p-3 bg-red-500/30 backdrop-blur-sm hover:bg-red-500/50 rounded-full transition-all duration-200 border border-red-300/40 shadow-lg hover:shadow-xl hover:scale-110"
                                                title="Delete Card"
                                            >
                                                <Trash className="h-4 w-4 text-white drop-shadow-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardCardsGrid;