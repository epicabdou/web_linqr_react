import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    $selectedCard,
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                setAuthMode('signup');
                                setShowAuthModal(true);
                            }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => {
                                setAuthMode('signin');
                                setShowAuthModal(true);
                            }}
                            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Create</h3>
                        <p className="text-gray-600">
                            Build professional digital business cards in minutes with our intuitive interface.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📱</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Sharing</h3>
                        <p className="text-gray-600">
                            Share your card via QR code, link, or directly through social platforms.
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
            </div>

            {showAuthModal && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    initialMode={authMode}
                />
            )}
        </div>
    );
};

const App: React.FC = () => {
    const isAuthenticated = useStore($isAuthenticated);
    const authLoading = useStore($authLoading);

    // Initialize data when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            cardsActions.fetchCards();
        }
    }, [isAuthenticated]);

    // Auth is automatically initialized when the store is imported
    // The initialize function is called automatically in authStore.ts

    if (authLoading) {
        return <Loading />;
    }

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    }
                />

                {/* Public card view (accessible without auth) */}
                <Route
                    path="/card/:cardId"
                    element={<PublicCardView />}
                />

                {/* Protected routes */}
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
                                <CreateCardView />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cards/edit/:cardId"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EditCardView />
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