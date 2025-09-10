import React from 'react';
import { User } from 'lucide-react';
import ContactInfo from './ContactInfo';
import CardActions from './CardActions';
import { Card } from '@/types';

interface CardPreviewProps {
    card: Card;
    setSelectedCard?: (card: Card | null) => void;
    setCurrentView?: (view: string) => void;
    isPreview?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
                                                     card,
                                                     setSelectedCard,
                                                     setCurrentView,
                                                     isPreview = false
                                                 }) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://linqr.app/card/${card.id}`)}`;

    // Template-based styling
    const getTemplateStyles = () => {
        switch (card.template) {
            case 'classic':
                return {
                    header: 'bg-gradient-to-br from-gray-600 to-gray-800',
                    accent: 'text-gray-100'
                };
            case 'minimal':
                return {
                    header: 'bg-gradient-to-br from-gray-300 to-gray-500',
                    accent: 'text-gray-100'
                };
            default: // modern
                return {
                    header: 'bg-gradient-to-br from-blue-600 to-purple-600',
                    accent: 'text-blue-100'
                };
        }
    };

    const styles = getTemplateStyles();

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto">
            {/* Header Section */}
            <div className={`${styles.header} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold truncate">{card.firstName} {card.lastName}</h3>
                        {card.title && (
                            <p className={`${styles.accent} text-sm truncate`}>{card.title}</p>
                        )}
                        {card.industry && (
                            <p className={`${styles.accent} text-xs truncate opacity-90`}>{card.industry}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Bio */}
                {card.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{card.bio}</p>
                )}

                {/* Contact Information */}
                <div className="space-y-2 text-sm mb-4">
                    <ContactInfo
                        icon="📧"
                        value={card.email}
                        href={`mailto:${card.email}`}
                    />
                    {card.phone && (
                        <ContactInfo
                            icon="📱"
                            value={card.phone}
                            href={`tel:${card.phone}`}
                        />
                    )}
                    {card.address && (
                        <ContactInfo icon="📍" value={card.address} />
                    )}
                </div>

                {/* Social Media Links */}
                {Object.values(card.socialMedia || {}).some(url => url) && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {card.socialMedia?.linkedin && (
                                <a
                                    href={card.socialMedia.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {card.socialMedia?.twitter && (
                                <a
                                    href={card.socialMedia.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full hover:bg-sky-200 transition-colors"
                                >
                                    Twitter
                                </a>
                            )}
                            {card.socialMedia?.github && (
                                <a
                                    href={card.socialMedia.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    GitHub
                                </a>
                            )}
                            {card.socialMedia?.website && (
                                <a
                                    href={card.socialMedia.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                                >
                                    Website
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Custom Links */}
                {card.customLinks && card.customLinks.length > 0 && (
                    <div className="mb-4">
                        <div className="space-y-1">
                            {card.customLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    🔗 {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* QR Code */}
                <div className="flex justify-center mt-6">
                    <div className="text-center">
                        <img
                            src={qrUrl}
                            alt="QR Code"
                            className="w-20 h-20 rounded-lg border border-gray-200 mx-auto"
                        />
                        <p className="text-xs text-gray-500 mt-1">Scan to save contact</p>
                    </div>
                </div>

                {/* Actions - Only show for non-preview cards */}
                {!isPreview && setSelectedCard && setCurrentView && (
                    <CardActions
                        card={card}
                        setSelectedCard={setSelectedCard}
                        setCurrentView={setCurrentView}
                    />
                )}

                {/* Scan Count - Only for real cards */}
                {!isPreview && (
                    <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              {card.scanCount || 0} {(card.scanCount || 0) === 1 ? 'scan' : 'scans'}
            </span>
                    </div>
                )}
            </div>

            {/* Preview Badge */}
            {isPreview && (
                <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
                    <p className="text-xs text-yellow-700 text-center font-medium">
                        🔍 Preview Mode - This is how your card will look
                    </p>
                </div>
            )}
        </div>
    );
};

export default CardPreview;