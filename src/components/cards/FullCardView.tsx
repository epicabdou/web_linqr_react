import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Share2, Download, Mail, Phone, MapPin, Globe, Linkedin, Twitter, Instagram, Github, Facebook, ArrowLeft, Copy, Check } from 'lucide-react';
import { cardsActions } from '../../stores/cardsStore';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import { Card } from '../../types';

interface FullCardViewProps {
    cardId?: number;
    setCurrentView?: (view: string) => void;
    card?: Card; // For when called from within app
    isPublic?: boolean; // For public sharing
}

const FullCardView: React.FC<FullCardViewProps> = ({
                                                       cardId,
                                                       setCurrentView,
                                                       card: propCard,
                                                       isPublic = false
                                                   }) => {
    const [card, setCard] = useState<Card | null>(propCard || null);
    const [loading, setLoading] = useState(!propCard);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Fetch card if cardId is provided and no card prop
    useEffect(() => {
        if (cardId && !propCard) {
            fetchCard();
        }
    }, [cardId, propCard]);

    const fetchCard = async () => {
        if (!cardId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await cardsActions.getCard(cardId);
            if (result.success && result.data) {
                setCard(result.data);
                // Record the scan
                await cardsActions.recordScan(cardId, {
                    location: await getLocationInfo(),
                    deviceInfo: getDeviceInfo(),
                    referrer: document.referrer,
                    ipAddress: null // Will be handled server-side
                });
            } else {
                setError(result.error || 'Card not found');
            }
        } catch (err) {
            setError('Failed to load card');
            console.error('Error fetching card:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLocationInfo = async () => {
        // Simple location detection (could be enhanced with actual geolocation)
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                city: data.city,
                country: data.country_name,
                coordinates: {
                    lat: data.latitude,
                    lng: data.longitude
                }
            };
        } catch {
            return null;
        }
    };

    const getDeviceInfo = () => {
        const ua = navigator.userAgent;
        let deviceType = 'Desktop';

        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            deviceType = 'Tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
            deviceType = 'Mobile';
        }

        return {
            type: deviceType,
            browser: getBrowserName(),
            os: getOSName()
        };
    };

    const getBrowserName = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    };

    const getOSName = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    };

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `${card?.firstName} ${card?.lastName} - Digital Business Card`,
            text: `Check out ${card?.firstName}'s digital business card`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Fallback to copying URL
                handleCopy(window.location.href, 'share');
            }
        } else {
            // Fallback to copying URL
            handleCopy(window.location.href, 'share');
        }
    };

    const downloadVCard = () => {
        if (!card) return;

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.firstName} ${card.lastName}
N:${card.lastName};${card.firstName};;;
ORG:${card.industry || ''}
TITLE:${card.title || ''}
TEL:${card.phone || ''}
EMAIL:${card.email}
ADR:;;${card.address || ''};;;;
URL:${card.socialMedia?.website || ''}
NOTE:${card.bio || ''}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.firstName}_${card.lastName}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const getTemplateStyles = (template: string) => {
        switch (template) {
            case 'classic':
                return 'bg-gradient-to-br from-gray-800 to-black text-white';
            case 'modern':
                return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
            case 'minimal':
                return 'bg-white text-gray-800 border-2 border-gray-200';
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

    const socialIcons = {
        linkedin: Linkedin,
        twitter: Twitter,
        instagram: Instagram,
        github: Github,
        facebook: Facebook,
        website: Globe
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading centered text="Loading card..." />
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
                    <p className="text-gray-600 mb-4">{error || 'The requested card could not be found.'}</p>
                    {setCurrentView && (
                        <Button onClick={() => setCurrentView('cards')}>
                            Back to Cards
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {setCurrentView && !isPublic && (
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentView('cards')}
                                icon={ArrowLeft}
                            >
                                Back
                            </Button>
                        )}
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                icon={copied === 'share' ? Check : Share2}
                                size="sm"
                            >
                                {copied === 'share' ? 'Copied!' : 'Share'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={downloadVCard}
                                icon={Download}
                                size="sm"
                            >
                                Save Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Card Display */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                            {/* Large Card View */}
                            <div className={`relative w-full h-64 rounded-2xl shadow-2xl overflow-hidden ${getTemplateStyles(card.template)}`}>
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

                                {/* Card Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        {/* Chip */}
                                        <div className="w-10 h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded shadow-sm"></div>
                                        {/* Card Number */}
                                        <div className="text-xs font-mono tracking-wider opacity-50">
                                            •••• •••• •••• {String(card.id).padStart(4, '0')}
                                        </div>
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">
                                            {card.firstName} {card.lastName}
                                        </h1>
                                        {card.title && (
                                            <p className="text-lg opacity-90">{card.title}</p>
                                        )}
                                        {card.industry && (
                                            <p className="text-sm opacity-75 uppercase tracking-wider mt-2">
                                                {card.industry}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                {card.email && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">{card.email}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(card.email, 'email')}
                                            icon={copied === 'email' ? Check : Copy}
                                        >
                                            {copied === 'email' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                )}

                                {card.phone && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">{card.phone}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(card.phone, 'phone')}
                                            icon={copied === 'phone' ? Check : Copy}
                                        >
                                            {copied === 'phone' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                )}

                                {card.address && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <span className="text-gray-700">{card.address}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(card.address, 'address')}
                                            icon={copied === 'address' ? Check : Copy}
                                        >
                                            {copied === 'address' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {card.bio && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                                <p className="text-gray-700 leading-relaxed">{card.bio}</p>
                            </div>
                        )}

                        {/* Social Media */}
                        {card.socialMedia && Object.values(card.socialMedia).some(url => url) && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(card.socialMedia).map(([platform, url]) => {
                                        if (!url) return null;
                                        const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                                        if (!IconComponent) return null;

                                        return (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                            >
                                                <IconComponent className="h-5 w-5 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {platform}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Custom Links */}
                        {card.customLinks && card.customLinks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
                                <div className="space-y-3">
                                    {card.customLinks.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                        >
                                            <Globe className="h-5 w-5 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {link.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullCardView;