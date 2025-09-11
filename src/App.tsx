import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import PublicCardView from './components/cards/PublicCardView';
import Loading from './components/ui/Loading';
import {
    $isAuthenticated,
    $loading as $authLoading,
    $isPremium,
    authActions
} from './stores/authStore';
import {
    $cards,
    cardsActions
} from './stores/cardsStore';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);

    if (authLoading) {
        return <Loading />;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);

    if (authLoading) {
        return <Loading />;
    }

    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Layout component for authenticated routes
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
                {children}
            </main>
        </div>
    );
};

// EditCardView wrapper that handles URL params
const EditCardViewWrapper: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();

    if (!cardId || isNaN(parseInt(cardId))) {
        return <Navigate to="/cards" replace />;
    }

    return <EditCardView />;
};

// PublicCardView wrapper that handles URL params
const PublicCardViewWrapper: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();

    if (!cardId || isNaN(parseInt(cardId))) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Card Not Found</h1>
                    <p className="text-gray-600">The card you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return <PublicCardView />;
};

// CreateCardView wrapper that checks permissions
const CreateCardViewWrapper: React.FC = () => {
    const isPremium = useStore($isPremium);
    const cards = useStore($cards);

    // Check if user can create more cards
    const canCreate = isPremium ? cards.length < 5 : cards.length < 1;

    if (!canCreate) {
        return <Navigate to="/upgrade" replace />;
    }

    return <CreateCardView />;
};

// Landing/Login page component
const LandingPage: React.FC = () => {
    const [showAuthModal, setShowAuthModal] = React.useState(true);
    const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">💼</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LinQR</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Create and share digital business cards that make lasting connections.
                        Share your professional information with a simple QR code scan.
                    </p>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                        <button
                            onClick={() => {
                                setAuthMode('signup');
                                setShowAuthModal(true);
                            }}
                            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => {
                                setAuthMode('signin');
                                setShowAuthModal(true);
                            }}
                            className="w-full sm:w-auto bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Features section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎨</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Templates</h3>
                        <p className="text-gray-600">
                            Choose from professionally designed templates that make you stand out.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Sharing</h3>
                        <p className="text-gray-600">
                            Share your card instantly with QR codes, links, or direct contact exchange.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Engagement</h3>
                        <p className="text-gray-600">
                            See how many people view your card and track your networking success.
                        </p>
                    </div>
                </div>

                {showAuthModal && (
                    <AuthModal
                        isOpen={showAuthModal}
                        onClose={() => setShowAuthModal(false)}
                        mode={authMode}
                        onModeChange={setAuthMode}
                    />
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);

    // Initialize auth when app starts
    useEffect(() => {
        authActions.initialize();
    }, []);

    // Fetch cards when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            cardsActions.fetchCards();
        }
    }, [isAuthenticated]);

    if (authLoading) {
        return <Loading />;
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    }
                />

                {/* Public card view - no authentication required */}
                <Route
                    path="/card/:cardId"
                    element={<PublicCardViewWrapper />}
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <CardsView />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/create"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <CreateCardViewWrapper />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/edit/:cardId"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EditCardViewWrapper />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ContactsManagement />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AnalyticsDashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/upgrade"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <UpgradeView />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SettingsView />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Default redirects */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" replace /> :
                            <Navigate to="/login" replace />
                    }
                />

                {/* Catch all route - redirect to dashboard or login */}
                <Route
                    path="*"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" replace /> :
                            <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;