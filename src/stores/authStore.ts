import { atom, computed } from 'nanostores';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Auth state atoms
export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $loading = atom<boolean>(true);
export const $error = atom<string | null>(null);
export const $userProfile = atom<any>(null);

// Computed values
export const $isAuthenticated = computed($user, (user) => !!user);
export const $userEmail = computed($user, (user) => user?.email || null);
export const $userId = computed($user, (user) => user?.id || null);

// Premium status computed from user profile
export const $isPremium = computed([$user, $userProfile], (user, profile) => {
    if (!user) return false;

    // Check multiple sources for premium status
    // 1. User metadata
    if (user.user_metadata?.is_premium) return true;

    // 2. App metadata (set by admin)
    if (user.app_metadata?.is_premium) return true;

    // 3. Profile data from database
    if (profile?.is_premium) return true;

    return false;
});

// Helper function to fetch user profile
const fetchUserProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

// Auth actions
export const authActions = {
    // Initialize auth state
    initialize: async () => {
        try {
            $loading.set(true);

            // Get initial session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                $error.set(error.message);
            }

            if (session) {
                $session.set(session);
                $user.set(session.user);

                // Fetch user profile for premium status
                const profile = await fetchUserProfile(session.user.id);
                $userProfile.set(profile);
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth state changed:', event, session);

                $session.set(session);
                $user.set(session?.user || null);

                if (session?.user) {
                    // Fetch user profile when user signs in
                    const profile = await fetchUserProfile(session.user.id);
                    $userProfile.set(profile);
                } else {
                    // Clear profile when user signs out
                    $userProfile.set(null);
                }

                if (event === 'SIGNED_OUT') {
                    // Clear all stores on sign out
                    $user.set(null);
                    $session.set(null);
                    $userProfile.set(null);
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            $error.set('Failed to initialize authentication');
        } finally {
            $loading.set(false);
        }
    },

    // Refresh user profile data
    refreshProfile: async () => {
        const user = $user.get();
        if (!user) return;

        const profile = await fetchUserProfile(user.id);
        $userProfile.set(profile);
    },

    // Update premium status
    updatePremiumStatus: async (isPremium: boolean) => {
        const user = $user.get();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        try {
            // Update in profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    is_premium: isPremium,
                    updated_at: new Date().toISOString()
                });

            if (profileError) {
                console.error('Error updating profile:', profileError);
                return { success: false, error: profileError.message };
            }

            // Update user metadata
            const { error: metadataError } = await supabase.auth.updateUser({
                data: { is_premium: isPremium }
            });

            if (metadataError) {
                console.error('Error updating user metadata:', metadataError);
                // Don't return error here as profile update succeeded
            }

            // Refresh profile data
            await authActions.refreshProfile();

            return { success: true };
        } catch (error) {
            console.error('Error updating premium status:', error);
            return { success: false, error: 'Failed to update premium status' };
        }
    },

    // Sign up with email/password
    signUp: async (email: string, password: string, metadata?: any) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

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

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            // Profile will be fetched automatically by auth state change listener
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

            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            });

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

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });

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

            const { error } = await supabase.auth.signOut();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

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

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

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

            const { data, error } = await supabase.auth.updateUser({
                password
            });

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
    }
};