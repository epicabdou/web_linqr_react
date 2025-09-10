import { atom, computed } from 'nanostores';
import { User, Session } from '@supabase/supabase-js';
import { auth } from '../lib/supabase';

// Auth state atoms
export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $loading = atom<boolean>(true);
export const $error = atom<string | null>(null);

// Computed values
export const $isAuthenticated = computed($user, (user) => !!user);
export const $userEmail = computed($user, (user) => user?.email || null);
export const $userId = computed($user, (user) => user?.id || null);
export const $isPremium = computed($user, (user) => {
    // Check user metadata for premium status
    return user?.user_metadata?.is_premium || false;
});

// Auth actions
export const authActions = {
    // Initialize auth state
    initialize: async () => {
        try {
            $loading.set(true);
            const { data } = await auth.getSession();

            if (data.session) {
                $session.set(data.session);
                $user.set(data.session.user);
            }

            // Listen for auth changes
            auth.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event, session);
                $session.set(session);
                $user.set(session?.user || null);

                if (event === 'SIGNED_OUT') {
                    // Clear all stores on sign out
                    $user.set(null);
                    $session.set(null);
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            $error.set('Failed to initialize authentication');
        } finally {
            $loading.set(false);
        }
    },

    // Sign up with email/password
    signUp: async (email: string, password: string, metadata?: any) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.signUp(email, password, metadata);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Sign in with email/password
    signIn: async (email: string, password: string) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.signIn(email, password);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            $session.set(data.session);
            $user.set(data.user);

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Sign in with magic link (OTP)
    signInWithOTP: async (email: string) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.signInWithOTP(email);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Magic link failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Sign in with OAuth
    signInWithOAuth: async (provider: 'google' | 'github' | 'linkedin_oidc') => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.signInWithOAuth(provider);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'OAuth sign in failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Sign out
    signOut: async () => {
        try {
            $loading.set(true);
            $error.set(null);

            const { error } = await auth.signOut();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            $user.set(null);
            $session.set(null);

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Reset password
    resetPassword: async (email: string) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.resetPassword(email);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Update password
    updatePassword: async (password: string) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await auth.updatePassword(password);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password update failed';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Clear error
    clearError: () => {
        $error.set(null);
    }
};

// Initialize auth on import
authActions.initialize();