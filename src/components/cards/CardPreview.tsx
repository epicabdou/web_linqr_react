import React from 'react';
import { User } from 'lucide-react';
import ContactInfo from './ContactInfo';
import CardActions from './CardActions';
import { Card } from '@/types';

interface CardPreviewProps {
    card: Card;
    setSelectedCard: (card: Card | null) => void;
    setCurrentView: (view: string) => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({
                                                     card,
                                                     setSelectedCard,
                                                     setCurrentView
                                                 }) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://linqr.app/card/${card.id}`)}`;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        {card.photo ? (
                            <img
                                src={card.photo}
                                alt={`${card.firstName} ${card.lastName}`}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-8 w-8" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{card.firstName} {card.lastName}</h3>
                        <p className="text-blue-100">{card.title}</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{card.bio}</p>

                {/* Contact Information */}
                <div className="space-y-2 text-sm">
                    <ContactInfo icon="📧" value={card.email} />
                    <ContactInfo icon="📱" value={card.phone} />
                    <ContactInfo icon="📍" value={card.address} />
                </div>

                {/* QR Code */}
                <div className="flex justify-center mt-6">
                    <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-24 h-24 rounded-lg border border-gray-200"
                    />
                </div>

                {/* Actions */}
                <CardActions
                    card={card}
                    setSelectedCard={setSelectedCard}
                    setCurrentView={setCurrentView}
                />
            </div>
        </div>
    );
};

export default CardPreview;