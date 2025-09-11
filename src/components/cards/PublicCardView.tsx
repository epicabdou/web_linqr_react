import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Download, Mail, Phone, MapPin, Globe, Linkedin, Twitter, Instagram, Github, Facebook, Copy, Check } from 'lucide-react';
import { cardsActions } from '../../stores/cardsStore';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import { Card } from '../../types';

const PublicCardView: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Fetch card data on mount
    useEffect(() => {
        if (cardId && !isNaN(parseInt(cardId))) {
            fetchCard();
        } else {
            setError('Invalid card ID');
            setLoading(false);
        }
    }, [cardId]);

    const fetchCard = async () => {
        if (!cardId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await cardsActions.getPublicCard(parseInt(cardId));
            if (result.success && result.data) {
                setCard(result.data);
                // Record the scan
                await recordScan();
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

    const recordScan = async () => {
        if (!cardId) return;

        try {
            await cardsActions.recordScan(parseInt(cardId), {
                location: await getLocationInfo(),
                deviceInfo: getDeviceInfo(),
                referrer: document.referrer,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to record scan:', error);
        }
    };

    const getLocationInfo = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return `${data.city}, ${data.country_name}`;
        } catch {
            return 'Unknown location';
        }
    };

    const getDeviceInfo = () => {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    };

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(type);
                setTimeout(() => setCopied(null), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
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

    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'linkedin':
                return <Linkedin className="h-5 w-5" />;
            case 'twitter':
                return <Twitter className="h-5 w-5" />;
            case 'instagram':
                return <Instagram className="h-5 w-5" />;
            case 'github':
                return <Github className="h-5 w-5" />;
            case 'facebook':
                return <Facebook className="h-5 w-5" />;
            case 'website':
                return <Globe className="h-5 w-5" />;
            default:
                return <Globe className="h-5 w-5" />;
        }
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
                <div className="text-center py-12 max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Card Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        {error || 'The card you\'re looking for doesn\'t exist or has been removed.'}
                    </p>
                    <a
                        href="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                    >
                        Create Your Own Card
                    </a>
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
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">💼</span>
                            <span className="text-xl font-bold text-gray-900">LinQR</span>
                        </div>
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
                                        <rect width="100" height="100" fill="url(#grid)"/>
                                    </svg>
                                </div>

                                {/* Card Content */}
                                <div className="relative h-full p-6 flex flex-col justify-between">
                                    {/* Top Section */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h1 className="text-xl font-bold leading-tight">
                                                    {card.firstName} {card.lastName}
                                                </h1>
                                                <p className="text-sm opacity-90">{card.title}</p>
                                            </div>
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
                                        <div className="text-xs opacity-75">
                                            Digital Business Card
                                        </div>
                                        <div className="text-xs opacity-75">
                                            LinQR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="space-y-4">
                                {card.email && (
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <a
                                            href={`mailto:${card.email}`}
                                            className="text-blue-600 hover:text-blue-700 transition-colors flex-1"
                                        >
                                            {card.email}
                                        </a>
                                        <button
                                            onClick={() => handleCopy(card.email, 'email')}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            {copied === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                )}

                                {card.phone && (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <a
                                            href={`tel:${card.phone}`}
                                            className="text-blue-600 hover:text-blue-700 transition-colors flex-1"
                                        >
                                            {card.phone}
                                        </a>
                                        <button
                                            onClick={() => handleCopy(card.phone, 'phone')}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            {copied === 'phone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                )}

                                {card.address && (
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-700 flex-1">{card.address}</span>
                                        <button
                                            onClick={() => handleCopy(card.address!, 'address')}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            {copied === 'address' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {card.bio && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                                <p className="text-gray-700 leading-relaxed">{card.bio}</p>
                            </div>
                        )}

                        {/* Social Media */}
                        {card.socialMedia && Object.keys(card.socialMedia).length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(card.socialMedia).map(([platform, url]) => (
                                        url && (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                {getSocialIcon(platform)}
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {platform}
                                                </span>
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Links */}
                        {card.customLinks && card.customLinks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
                                <div className="space-y-3">
                                    {card.customLinks.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Globe className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {link.title}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Save Contact</h2>
                            <div className="space-y-4">
                                <Button
                                    onClick={downloadVCard}
                                    icon={Download}
                                    className="w-full"
                                >
                                    Download vCard
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleShare}
                                    icon={copied === 'share' ? Check : Share2}
                                    className="w-full"
                                >
                                    {copied === 'share' ? 'Link Copied!' : 'Share Card'}
                                </Button>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h2>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.href)}&bgcolor=ffffff&color=000000&format=png&ecc=M`}
                                        alt="QR Code for this card"
                                        className="w-40 h-40"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                    Scan to view this card on any device
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCopy(window.location.href, 'qr')}
                                        className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
                                    >
                                        {copied === 'qr' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        <span>{copied === 'qr' ? 'Copied!' : 'Copy URL'}</span>
                                    </button>
                                    <a
                                        href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(window.location.href)}&bgcolor=ffffff&color=000000&format=png&ecc=M`}
                                        download="qr-code.png"
                                        className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
                                    >
                                        <Download className="h-3 w-3" />
                                        <span>Download QR</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t mt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="text-2xl">💼</span>
                            <span className="text-xl font-bold text-gray-900">LinQR</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Create your own digital business card
                        </p>
                        <a
                            href="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                        >
                            Get Started Free
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicCardView;