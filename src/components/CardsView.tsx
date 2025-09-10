import React from 'react';
import { Plus } from 'lucide-react';
import CardPreview from './cards/CardPreview';
import EmptyState from './ui/EmptyState';
import { Card } from '../types';

interface CardsViewProps {
    cards: Card[];
    isPremium: boolean;
    setCurrentView: (view: string) => void;
    setSelectedCard: (card: Card | null) => void;
}

const CardsView: React.FC<CardsViewProps> = ({
                                                 cards,
                                                 isPremium,
                                                 setCurrentView,
                                                 setSelectedCard
                                             }) => {
    const handleCreateCard = () => {
        if (!isPremium && cards.length >= 1) {
            setCurrentView('upgrade');
        } else {
            setCurrentView('create-card');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
                    <p className="mt-2 text-gray-600">
                        {isPremium
                            ? `${cards.length}/5 cards created`
                            : `${cards.length}/1 card created (Free Plan)`
                        }
                    </p>
                </div>
                <button
                    onClick={handleCreateCard}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Card</span>
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map(card => (
                    <CardPreview
                        key={card.id}
                        card={card}
                        setCurrentView={setCurrentView}
                        setSelectedCard={setSelectedCard}
                    />
                ))}

                {/* Empty State for Free Users */}
                {!isPremium && cards.length < 1 && (
                    <EmptyState
                        title="Create Your First Card"
                        description="Start building your digital business card"
                        buttonText="Get Started"
                        onClick={() => setCurrentView('create-card')}
                    />
                )}
            </div>
        </div>
    );
};

export default CardsView;