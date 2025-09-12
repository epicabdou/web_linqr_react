import React from 'react';
import CardActions from './CardActions';
import { Card } from '../../types';

interface CardPreviewProps {
    card: Card;
    setCurrentView?: (view: string) => void;
    setSelectedCard?: (card: Card | null) => void;
    isPreview?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
                                                     card,
                                                     setCurrentView,
                                                     setSelectedCard,
                                                     isPreview = false
                                                 }) => {
    // Generate QR code URL (placeholder)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
        `${window.location.origin}/card/${card.id}`
    )}`;

    const getTemplateStyles = (template: string) => {
        switch (template) {
            case 'classic':
                return {
                    container: 'bg-gradient-to-br from-gray-800 to-black text-white',
                    accent: 'text-gray-300',
                    chip: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
                };
            case 'modern':
                return {
                    container: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
                    accent: 'text-blue-200',
                    chip: 'bg-gradient-to-r from-cyan-400 to-blue-400',
                };
            case 'minimal':
                return {
                    container: 'bg-white text-gray-800 border-2 border-gray-200',
                    accent: 'text-gray-600',
                    chip: 'bg-gradient-to-r from-gray-400 to-gray-600',
                };
            case 'gold':
                return {
                    container: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900',
                    accent: 'text-yellow-800',
                    chip: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
                };
            case 'platinum':
                return {
                    container: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900',
                    accent: 'text-gray-700',
                    chip: 'bg-gradient-to-r from-gray-600 to-gray-800',
                };
            case 'neon':
                return {
                    container: 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white',
                    accent: 'text-pink-200',
                    chip: 'bg-gradient-to-r from-green-400 to-cyan-400',
                };
            case 'carbon':
                return {
                    container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400',
                    accent: 'text-green-300',
                    chip: 'bg-gradient-to-r from-green-500 to-emerald-500',
                };
            case 'rose':
                return {
                    container: 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900',
                    accent: 'text-rose-800',
                    chip: 'bg-gradient-to-r from-rose-600 to-pink-600',
                };
            default:
                return {
                    container: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
                    accent: 'text-blue-200',
                    chip: 'bg-gradient-to-r from-cyan-400 to-blue-400',
                };
        }
    };

    const styles = getTemplateStyles(card.template);

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simplified Bank Card Style - Only Name, Title, QR, and Basic Info */}
            <div className={`relative w-full h-48 rounded-2xl shadow-xl overflow-hidden ${styles.container}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Card Chip */}
                <div className="absolute top-4 left-4">
                    <div className={`w-8 h-6 rounded ${styles.chip} shadow-sm`}></div>
                </div>

                {/* Card Number (Stylized) */}
                <div className="absolute top-4 right-4 text-xs font-mono tracking-wider opacity-50">
                    •••• •••• •••• {String(card.id).padStart(4, '0')}
                </div>

                {/* Main Content - Name and Title Only */}
                <div className="absolute bottom-6 left-4 right-4">
                    {/* Name */}
                    <div className="mb-2">
                        <h2 className="text-lg font-bold tracking-wide">
                            {card.firstName} {card.lastName}
                        </h2>
                        {card.title && (
                            <p className={`text-sm ${styles.accent} font-medium`}>
                                {card.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* QR Code - Smaller and positioned in bottom right */}
                <div className="absolute bottom-4 right-4">
                    <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-18 h-18 rounded border border-white border-opacity-20"
                    />
                </div>

                {/* Card Type Badge */}
                <div className="absolute bottom-4 left-4">
                    <div className={`text-xs font-bold uppercase tracking-wider ${styles.accent} opacity-70`}>
                        {card.template === 'gold' ? 'Elite' :
                            card.template === 'platinum' ? 'Platinum' :
                                card.template === 'carbon' ? 'Black' :
                                    card.template === 'neon' ? 'Neon' :
                                        card.template === 'rose' ? 'Rose' : 'Classic'}
                    </div>
                </div>
            </div>

            {/* Card Info Panel - Simplified */}
            <div className="mt-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Scan Count */}
                {!isPreview && (
                    <div className="px-4 py-3 text-center border-b border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
                                {card.scanCount || 0} {(card.scanCount || 0) === 1 ? 'scan' : 'scans'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Actions - Only show for non-preview cards */}
                {!isPreview && setSelectedCard && setCurrentView && (
                    <div className="p-4">
                        <CardActions
                            card={card}
                            setSelectedCard={setSelectedCard}
                            setCurrentView={setCurrentView}
                        />
                    </div>
                )}

                {/* Preview Badge */}
                {isPreview && (
                    <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
                        <p className="text-xs text-yellow-700 text-center font-medium">
                            🔍 Preview Mode - This is how your card will appear in the gallery
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardPreview;