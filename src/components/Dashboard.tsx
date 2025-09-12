import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { $cards, $totalScans, $isPremium, cardsActions } from '../stores';
import { Card } from '../types';

// Import the new components
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import DashboardCardsGrid from './dashboard/DashboardCardsGrid';
import DashboardQuickActions from './dashboard/DashboardQuickActions';

const Dashboard: React.FC = () => {
    const cards = useStore($cards);
    const totalScans = useStore($totalScans);
    const isPremium = useStore($isPremium);
    const navigate = useNavigate();
    const [copiedCardId, setCopiedCardId] = useState<number | null>(null);

    useEffect(() => {
        // Fetch cards when dashboard loads
        cardsActions.fetchCards();
    }, []);

    const handleEditCard = (cardId: number) => {
        navigate(`/cards/edit/${cardId}`);
    };

    const handleViewCard = (cardId: number) => {
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
                if (err instanceof Error && err.name === 'AbortError') {
                    console.log('Share cancelled by user');
                    return;
                }
                console.error('Web Share API failed:', err);
                // Fall back to copy-to-clipboard
                fallbackShareCard(card.id, shareUrl);
            }
        } else {
            // Fallback to copy-to-clipboard
            fallbackShareCard(card.id, shareUrl);
        }
    };

    const fallbackShareCard = (cardId: number, text: string) => {
        // Create a temporary text area for copying
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);

        try {
            // Try the newer Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log('Copied via Clipboard API');
                    setCopiedCardId(cardId);
                    setTimeout(() => setCopiedCardId(null), 2000);
                }).catch((clipboardErr) => {
                    console.error('Clipboard API failed:', clipboardErr);
                    // Try execCommand as fallback
                    tryExecCommand(textArea, cardId, text);
                });
            } else {
                // Use execCommand fallback
                tryExecCommand(textArea, cardId, text);
            }
        } catch (err) {
            console.error('All copy methods failed:', err);
            // Show the URL in a prompt as last resort
            prompt('Copy this link to share the card:', text);
        } finally {
            document.body.removeChild(textArea);
        }
    };

    const tryExecCommand = (textArea: HTMLTextAreaElement, cardId: number, text: string) => {
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices

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
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        // This would typically show a confirmation dialog first
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await cardsActions.deleteCard(cardId);
                console.log('Card deleted successfully');
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        }
    };

    // Calculate derived values
    const canCreateCard = isPremium ? cards.length < 5 : cards.length < 1;
    const recentViews = Math.floor(totalScans * 0.3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <DashboardHeader />

            {/* Quick Stats Section */}
            <DashboardStats
                cardsCount={cards.length}
                totalScans={totalScans}
                recentViews={recentViews}
                isPremium={isPremium}
            />

            {/* Cards Grid Section */}
            <DashboardCardsGrid
                cards={cards}
                copiedCardId={copiedCardId}
                onViewCard={handleViewCard}
                onEditCard={handleEditCard}
                onShareCard={handleShareCard}
                onDeleteCard={handleDeleteCard}
                canCreateCard={canCreateCard}
                isPremium={isPremium}
            />

            {/* Quick Actions Section */}
            <DashboardQuickActions />
        </div>
    );
};

export default Dashboard;