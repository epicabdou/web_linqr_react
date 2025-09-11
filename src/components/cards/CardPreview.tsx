import React from 'react';
import QRCode from 'qrcode';
import { Card } from '../../types';

interface CardPreviewProps {
    card: Partial<Card>;
    isPreview?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ card, isPreview = false }) => {
    const [qrUrl, setQrUrl] = React.useState<string>('');

    React.useEffect(() => {
        const generateQR = async () => {
            try {
                const cardUrl = `${window.location.origin}/card/${card.id || 'preview'}`;
                const qr = await QRCode.toDataURL(cardUrl, {
                    width: 128,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                });
                setQrUrl(qr);
            } catch (error) {
                console.error('Failed to generate QR code:', error);
            }
        };

        generateQR();
    }, [card.id]);

    const getTemplateStyles = (template: string) => {
        switch (template) {
            case 'classic':
                return {
                    container: 'bg-gradient-to-br from-gray-800 to-black text-white',
                    accent: 'text-gray-300',
                    chip: 'bg-gradient-to-r from-gray-600 to-gray-800',
                    pattern: 'stroke-gray-600',
                    number: 'text-gray-400'
                };
            case 'modern':
                return {
                    container: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
                    accent: 'text-blue-200',
                    chip: 'bg-gradient-to-r from-cyan-400 to-blue-400',
                    pattern: 'stroke-blue-400',
                    number: 'text-blue-300'
                };
            case 'minimal':
                return {
                    container: 'bg-white border-2 border-gray-200 text-gray-800',
                    accent: 'text-gray-600',
                    chip: 'bg-gradient-to-r from-gray-400 to-gray-600',
                    pattern: 'stroke-gray-300',
                    number: 'text-gray-500'
                };
            case 'gold':
                return {
                    container: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900',
                    accent: 'text-yellow-800',
                    chip: 'bg-gradient-to-r from-yellow-600 to-amber-600',
                    pattern: 'stroke-yellow-600',
                    number: 'text-yellow-700'
                };
            case 'platinum':
                return {
                    container: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900',
                    accent: 'text-gray-700',
                    chip: 'bg-gradient-to-r from-gray-600 to-gray-800',
                    pattern: 'stroke-gray-600',
                    number: 'text-gray-600'
                };
            case 'neon':
                return {
                    container: 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white',
                    accent: 'text-pink-200',
                    chip: 'bg-gradient-to-r from-green-400 to-cyan-400',
                    pattern: 'stroke-pink-400',
                    number: 'text-purple-200'
                };
            case 'carbon':
                return {
                    container: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-green-400',
                    accent: 'text-green-300',
                    chip: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    pattern: 'stroke-green-600',
                    number: 'text-green-500'
                };
            case 'rose':
                return {
                    container: 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 text-gray-900',
                    accent: 'text-rose-800',
                    chip: 'bg-gradient-to-r from-rose-600 to-pink-600',
                    pattern: 'stroke-rose-600',
                    number: 'text-rose-700'
                };
            default:
                return {
                    container: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
                    accent: 'text-blue-200',
                    chip: 'bg-gradient-to-r from-cyan-400 to-blue-400',
                    pattern: 'stroke-blue-400',
                    number: 'text-blue-300'
                };
        }
    };

    const styles = getTemplateStyles(card.template || 'modern');

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Bank Card Style Design */}
            <div className={`relative w-full h-48 rounded-2xl shadow-xl overflow-hidden ${styles.container}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <pattern id={`grid-${card.id || 'preview'}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" className={styles.pattern} strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill={`url(#grid-${card.id || 'preview'})`} />
                    </svg>
                </div>

                {/* Card Chip */}
                <div className="absolute top-4 left-4">
                    <div className={`w-10 h-7 rounded ${styles.chip} shadow-lg opacity-90`}>
                        <div className="w-full h-full rounded bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>
                </div>

                {/* Card Number (Stylized) */}
                <div className={`absolute top-4 right-4 text-xs font-mono tracking-wider ${styles.number}`}>
                    •••• •••• •••• {String(card.id || '0000').padStart(4, '0')}
                </div>

                {/* Card Type/Template Badge */}
                <div className="absolute top-14 left-4">
                    <div className={`text-xs font-bold uppercase tracking-wider ${styles.accent} opacity-70`}>
                        {card.template === 'gold' ? 'Elite' :
                            card.template === 'platinum' ? 'Platinum' :
                                card.template === 'carbon' ? 'Black' :
                                    card.template === 'neon' ? 'Neon' :
                                        card.template === 'rose' ? 'Rose' :
                                            card.template === 'classic' ? 'Classic' :
                                                card.template === 'minimal' ? 'Essential' : 'Modern'}
                    </div>
                </div>

                {/* Main Content - Name and Title */}
                <div className="absolute bottom-6 left-4 right-20">
                    <div className="mb-2">
                        <h2 className="text-lg font-bold tracking-wide truncate">
                            {card.firstName || 'First'} {card.lastName || 'Last'}
                        </h2>
                        {card.title && (
                            <p className={`text-sm ${styles.accent} font-medium truncate`}>
                                {card.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* QR Code - Bottom Right */}
                <div className="absolute bottom-4 right-4">
                    {qrUrl && (
                        <img
                            src={qrUrl}
                            alt="QR Code"
                            className="w-12 h-12 rounded border border-white/20 bg-white p-1"
                        />
                    )}
                </div>

                {/* Holographic Effect (for premium templates) */}
                {['gold', 'platinum', 'neon'].includes(card.template || '') && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
                )}
            </div>

            {/* Card Info Panel - Simplified */}
            {!isPreview && (
                <div className="mt-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {/* Scan Count */}
                    <div className="px-4 py-3 text-center border-b border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">
                                {card.scanCount || 0} {(card.scanCount || 0) === 1 ? 'scan' : 'scans'} this month
                            </span>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Status: {card.isActive !== false ? 'Active' : 'Inactive'}</span>
                            <span>Template: {card.template || 'Modern'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardPreview;