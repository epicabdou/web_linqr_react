import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CardsView from './components/CardsView';
import CreateCardView from './components/cards/CreateCardView';
import UpgradeView from './components/UpgradeView';
import ContactsManagement from './components/contacts/ContactsManagement';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import SettingsView from './components/SettingsView';
import AuthModal from './components/auth/AuthModal';
import Loading from './components/ui/Loading';
import {
    $isAuthenticated,
    $loading as $authLoading,
    authActions
} from './stores/authStore';
import { cardsActions } from './stores/cardsStore';
import { Card } from './types';

export interface AppProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    cards: Card[];
    setCards: (cards: Card[]) => void;
    selectedCard: Card | null;
    setSelectedCard: (card: Card | null) => void;
    isPremium: boolean;
    setIsPremium: (premium: boolean) => void;
}

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);

    // Initialize data when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            // Fetch user's cards
            cardsActions.fetchCards();
            setShowAuthModal(false);
        }
    }, [isAuthenticated]);

    // Show auth modal for unauthenticated users
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            setShowAuthModal(true);
        }
    }, [authLoading, isAuthenticated]);

    const appProps: AppProps = {
        currentView,
        setCurrentView,
        cards,
        setCards,
        selectedCard,
        setSelectedCard,
        isPremium,
        setIsPremium
    };

    const handleSignOut = async () => {
        await authActions.signOut();
        setCurrentView('dashboard');
        setCards([]);
        setSelectedCard(null);
        setIsPremium(false);
        setShowAuthModal(true);
    };

    const renderCurrentView = () => {
        if (!isAuthenticated) {
            return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">💼</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LinQR</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Create and share digital business cards that make lasting connections.
                            Build your professional network with beautiful, interactive cards.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Sharing</h3>
                                <p className="text-gray-600">Share your card via QR code, link, or direct contact</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                                <p className="text-gray-600">Track scans and engagement with detailed analytics</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎨</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Design</h3>
                                <p className="text-gray-600">Choose from multiple templates and customize your style</p>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    setAuthMode('signup');
                                    setShowAuthModal(true);
                                }}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Get Started Free
                            </button>
                            <button
                                onClick={() => {
                                    setAuthMode('signin');
                                    setShowAuthModal(true);
                                }}
                                className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        switch (currentView) {
            case 'dashboard':
                return <Dashboard {...appProps} />;
            case 'cards':
                return <CardsView {...appProps} />;
            case 'create-card':
                return <CreateCardView setCurrentView={setCurrentView} />;
            case 'upgrade':
                return <UpgradeView {...appProps} />;
            case 'contacts':
                return <ContactsManagement setCurrentView={setCurrentView} />;
            case 'analytics':
                return <AnalyticsDashboard setCurrentView={setCurrentView} />;
            case 'settings':
                return <SettingsView {...appProps} />;
            default:
                return <Dashboard {...appProps} />;
        }
    };

    // Show loading screen during initial auth check
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading centered text="Loading LinQR..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation
                {...appProps}
                onSignOut={handleSignOut}
                showAuthButton={!isAuthenticated}
                onAuthClick={() => setShowAuthModal(true)}
            />
            {renderCurrentView()}

            {/* Authentication Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => !isAuthenticated ? {} : setShowAuthModal(false)}
                defaultMode={authMode}
            />
        </div>
    );
};

export default App;