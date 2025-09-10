import React from 'react';
import { Share2, Edit3, Eye } from 'lucide-react';
import { Card } from '@/types';

interface CardActionsProps {
    card: Card;
    setSelectedCard: (card: Card | null) => void;
    setCurrentView: (view: string) => void;
}

const CardActions: React.FC<CardActionsProps> = ({
                                                     card,
                                                     setSelectedCard,
                                                     setCurrentView
                                                 }) => {
    const handleShare = () => {
        // TODO: Implement share functionality
        console.log('Share card:', card.id);
    };

    const handleEdit = () => {
        setSelectedCard(card);
        setCurrentView('edit-card');
    };

    const handleView = () => {
        setSelectedCard(card);
        setCurrentView('view-card');
    };

    return (
        <div className="flex space-x-2 mt-4">
            <button
                onClick={handleShare}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                title="Share Card"
            >
                <Share2 className="h-4 w-4" />
            </button>
            <button
                onClick={handleEdit}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                title="Edit Card"
            >
                <Edit3 className="h-4 w-4" />
            </button>
            <button
                onClick={handleView}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                title="View Card"
            >
                <Eye className="h-4 w-4" />
            </button>
        </div>
    );
};

export default CardActions;