// stores/settingsStore.ts
import { atom } from 'nanostores';
import { supabase } from '../lib/supabase';
import { $user, $userProfile, authActions } from './authStore';

// Settings state atoms
export const $settingsLoading = atom<boolean>(false);
export const $settingsError = atom<string | null>(null);

// User preferences interface
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    profileVisibility: 'public' | 'private';
    language: string;
    timezone: string;
    notifications: {
        email: {
            newScans: boolean;
            weeklyReports: boolean;
            accountUpdates: boolean;
            marketing: boolean;
        };
        push: {
            newScans: boolean;
            newContacts: boolean;
            cardShares: boolean;
        };
    };
    analyticsSharing: boolean;
}

// Default preferences
const defaultPreferences: UserPreferences = {
    theme: 'light',
    profileVisibility: 'public',
    language: 'en',
    timezone: 'UTC-5',
    notifications: {
        email: {
            newScans: true,
            weeklyReports: true,
            accountUpdates: true,
            marketing: false
        },
        push: {
            newScans: true,
            newContacts: true,
            cardShares: true
        }
    },
    analyticsSharing: true
};

// Settings actions
export const settingsActions = {
    // Update user profile information
    updateProfile: async (profileData: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
    }) => {
        const user = $user.get();
        if (!user) {
            $settingsError.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: profileData.firstName,
                    last_name: profileData.lastName,
                    avatar_url: profileData.avatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) {
                console.error('Error updating profile:', error);
                $settingsError.set(error.message);
                return { success: false, error: error.message };
            }

            // Refresh profile data
            await authActions.refreshProfile();

            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = 'Failed to update profile';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Update user preferences
    updatePreferences: async (preferences: Partial<UserPreferences>) => {
        const user = $user.get();
        const currentProfile = $userProfile.get();

        if (!user) {
            $settingsError.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            // Merge with existing preferences
            const currentPreferences = currentProfile?.preferences || defaultPreferences;
            const updatedPreferences = { ...currentPreferences, ...preferences };

            const { error } = await supabase
                .from('profiles')
                .update({
                    preferences: updatedPreferences,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) {
                console.error('Error updating preferences:', error);
                $settingsError.set(error.message);
                return { success: false, error: error.message };
            }

            // Refresh profile data
            await authActions.refreshProfile();

            return { success: true };
        } catch (error) {
            console.error('Error updating preferences:', error);
            const errorMessage = 'Failed to update preferences';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Change password
    changePassword: async (currentPassword: string, newPassword: string) => {
        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            // First verify current password by attempting to sign in
            const user = $user.get();
            if (!user?.email) {
                throw new Error('User email not found');
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            });

            if (signInError) {
                $settingsError.set('Current password is incorrect');
                return { success: false, error: 'Current password is incorrect' };
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                console.error('Error updating password:', updateError);
                $settingsError.set(updateError.message);
                return { success: false, error: updateError.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error);
            const errorMessage = 'Failed to change password';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Export user data
    exportUserData: async () => {
        const user = $user.get();
        if (!user) {
            $settingsError.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            // Fetch all user data
            const [profileResponse, cardsResponse, contactsResponse] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('cards').select('*').eq('user_id', user.id),
                supabase.from('contacts').select('*').eq('user_id', user.id)
            ]);

            const userData = {
                profile: profileResponse.data,
                cards: cardsResponse.data,
                contacts: contactsResponse.data,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            // Create and download file
            const blob = new Blob([JSON.stringify(userData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `linqr-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('Error exporting data:', error);
            const errorMessage = 'Failed to export data';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Delete user account
    deleteAccount: async () => {
        const user = $user.get();
        if (!user) {
            $settingsError.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            // Delete all user data (CASCADE should handle this, but being explicit)
            await Promise.all([
                supabase.from('contacts').delete().eq('user_id', user.id),
                supabase.from('cards').delete().eq('user_id', user.id),
                supabase.from('profiles').delete().eq('id', user.id)
            ]);

            // Delete auth user
            const { error } = await supabase.auth.admin.deleteUser(user.id);

            if (error) {
                console.error('Error deleting account:', error);
                $settingsError.set(error.message);
                return { success: false, error: error.message };
            }

            // Sign out
            await supabase.auth.signOut();

            return { success: true };
        } catch (error) {
            console.error('Error deleting account:', error);
            const errorMessage = 'Failed to delete account';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Update email (requires verification)
    updateEmail: async (newEmail: string) => {
        $settingsLoading.set(true);
        $settingsError.set(null);

        try {
            const { error } = await supabase.auth.updateUser({
                email: newEmail
            });

            if (error) {
                console.error('Error updating email:', error);
                $settingsError.set(error.message);
                return { success: false, error: error.message };
            }

            return {
                success: true,
                message: 'Verification email sent to your new email address'
            };
        } catch (error) {
            console.error('Error updating email:', error);
            const errorMessage = 'Failed to update email';
            $settingsError.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $settingsLoading.set(false);
        }
    },

    // Clear errors
    clearError: () => {
        $settingsError.set(null);
    }
};