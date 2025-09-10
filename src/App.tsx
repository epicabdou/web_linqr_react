import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CardsView from './components/CardsView.tsx';
import UpgradeView from './components/UpgradeView';
import ContactsView from './components/ContactsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import { Card } from './types';

// Mock data
const mockCard: Card = {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    title: 'Senior Software Engineer',
    industry: 'Technology',
    bio: 'Passionate about building innovative web applications and leading development teams.',
    photo: null,
    phone: '+1 (555) 123-4567',
    email: 'john.smith@example.com',
    address: 'San Francisco, CA',
    socialMedia: {
        linkedin: 'https://linkedin.com/in/johnsmith',
        twitter: 'https://twitter.com/johnsmith'
    },
    customLinks: [
        { name: 'Portfolio', url: 'https://johnsmith.dev' },
        { name: 'Blog', url: 'https://blog.johnsmith.dev' }
    ],
    template: 'modern'
};

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
    const [cards, setCards] = useState<Card[]>([mockCard]);
    const [selectedCard, setSelectedCard] = useState<Card | null>(mockCard);
    const [isPremium, setIsPremium] = useState(false);

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

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard {...appProps} />;
            case 'cards':
                return <CardsView {...appProps} />;
            case 'upgrade':
                return <UpgradeView {...appProps} />;
            case 'contacts':
                return <ContactsView {...appProps} />;
            case 'analytics':
                return <AnalyticsView {...appProps} />;
            case 'settings':
                return <SettingsView {...appProps} />;
            default:
                return <Dashboard {...appProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation {...appProps} />
            {renderCurrentView()}
        </div>
    );
};

export default App;