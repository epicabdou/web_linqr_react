import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CardsView from './components/CardsView';
import CreateCardView from './components/cards/CreateCardView';
import EditCardView from './components/cards/EditCardView';
import UpgradeView from './components/UpgradeView';
import ContactsManagement from './components/contacts/ContactsManagement';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import SettingsView from './components/SettingsView';
import AuthModal from './components/auth/AuthModal';
import Loading from './components/ui/Loading';
import {
    $isAuthenticated,
    $loading as $authLoading,
    $isPremium,
    authActions
} from './stores/authStore';
import {
    $cards,
    $selectedCard,
    cardsActions
} from './stores/cardsStore';
import Button from "./components/ui/Button";

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Use store values instead of local state
    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);
    const cards = useStore($cards);
    const selectedCard = useStore($selectedCard);
    const isPremium = useStore($isPremium);

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

    const handleSignOut = async () => {
        try {
            await authActions.signOut();
            setCurrentView('dashboard');
            setShowAuthModal(true);
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Templates</h3>
                                <p className="text-gray-600">Choose from beautiful, professional templates</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => {
                                    setAuthMode('signup');
                                    setShowAuthModal(true);
                                }}
                                size="lg"
                                className="px-8"
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAuthMode('signin');
                                    setShowAuthModal(true);
                                }}
                                size="lg"
                                className="px-8"
                            >
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        switch (currentView) {
            case 'dashboard':
                return (
                    <Dashboard
                        cards={cards}
                        setCurrentView={setCurrentView}
                    />
                );
            case 'cards':
                return (
                    <CardsView
                        cards={cards}
                        isPremium={isPremium}
                        setCurrentView={setCurrentView}
                        setSelectedCard={(card) => cardsActions.setSelectedCard(card)}
                    />
                );
            case 'create-card':
                return <CreateCardView setCurrentView={setCurrentView} />;
            case 'edit-card':
                return <EditCardView setCurrentView={setCurrentView} />;
            case 'upgrade':
                return (
                    <UpgradeView
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        cards={cards}
                        setCards={() => {}} // Not needed with store
                        selectedCard={selectedCard}
                        setSelectedCard={(card) => cardsActions.setSelectedCard(card)}
                        isPremium={isPremium}
                        setIsPremium={() => {}} // Not needed with store
                    />
                );
            case 'contacts':
                return <ContactsManagement setCurrentView={setCurrentView} />;
            case 'analytics':
                return <AnalyticsDashboard setCurrentView={setCurrentView} />;
            case 'settings':
                return (
                    <SettingsView
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        cards={cards}
                        setCards={() => {}} // Not needed with store
                        selectedCard={selectedCard}
                        setSelectedCard={(card) => cardsActions.setSelectedCard(card)}
                        isPremium={isPremium}
                        setIsPremium={() => {}} // Not needed with store
                    />
                );
            default:
                return (
                    <Dashboard
                        cards={cards}
                        setCurrentView={setCurrentView}
                    />
                );
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
                currentView={currentView}
                setCurrentView={setCurrentView}
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