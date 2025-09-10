import { atom, computed } from 'nanostores';
import { Card } from '@/types';
import supabase from '../lib/supabase';
import { $userId, $isPremium } from './authStore';

// Cards state atoms
export const $cards = atom<Card[]>([]);
export const $selectedCard = atom<Card | null>(null);
export const $loading = atom<boolean>(false);
export const $error = atom<string | null>(null);

// Computed values
export const $cardsCount = computed($cards, (cards) => cards.length);
export const $activeCards = computed($cards, (cards) =>
    cards.filter(card => card.isActive !== false)
);
export const $totalScans = computed($cards, (cards) =>
    cards.reduce((total, card) => total + (card.scanCount || 0), 0)
);

// Check if user can create more cards
export const $canCreateCard = computed([$cards, $isPremium], (cards, isPremium) => {
    if (isPremium) {
        return cards.length < 5; // Premium limit
    }
    return cards.length < 1; // Free limit
});

// Helper function to ensure user profile exists
const ensureProfileExists = async (userId: string, userEmail?: string) => {
    try {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (existingProfile) {
            return { success: true };
        }

        // If profile doesn't exist, create it
        if (fetchError && fetchError.code === 'PGRST116') { // No rows returned
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: userEmail || '',
                    first_name: null,
                    last_name: null
                });

            if (insertError) {
                console.error('Failed to create profile:', insertError);
                return { success: false, error: insertError.message };
            }

            return { success: true };
        }

        // Other errors
        return { success: false, error: fetchError?.message || 'Unknown error checking profile' };
    } catch (error) {
        console.error('Error ensuring profile exists:', error);
        return { success: false, error: 'Failed to ensure profile exists' };
    }
};

// Database mapping helpers
const mapDbCardToCard = (dbCard: any): Card => ({
    id: dbCard.id,
    firstName: dbCard.first_name,
    lastName: dbCard.last_name,
    title: dbCard.title || '',
    industry: dbCard.industry || '',
    bio: dbCard.bio || '',
    photo: dbCard.photo_url,
    phone: dbCard.phone || '',
    email: dbCard.email,
    address: dbCard.address || '',
    socialMedia: dbCard.social_media || {},
    customLinks: dbCard.custom_links || [],
    template: dbCard.template || 'modern',
    isActive: dbCard.is_active,
    scanCount: dbCard.scan_count || 0,
    createdAt: new Date(dbCard.created_at),
    updatedAt: new Date(dbCard.updated_at)
});

const mapCardToDbCard = (card: Partial<Card>, userId: string) => ({
    user_id: userId,
    first_name: card.firstName,
    last_name: card.lastName,
    title: card.title || null,
    industry: card.industry || null,
    bio: card.bio || null,
    photo_url: card.photo || null,
    phone: card.phone || null,
    email: card.email,
    address: card.address || null,
    social_media: card.socialMedia || {},
    custom_links: card.customLinks || [],
    template: card.template || 'modern',
    is_active: card.isActive !== false
});

// Cards actions
export const cardsActions = {
    // Fetch user's cards
    fetchCards: async () => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const cards = data.map(mapDbCardToCard);
            $cards.set(cards);

            return { success: true, data: cards };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cards';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Create new card
    createCard: async (cardData: Partial<Card>) => {
        const userId = $userId.get();
        const isPremium = $isPremium.get();
        const currentCards = $cards.get();

        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        // Check limits
        if (!isPremium && currentCards.length >= 1) {
            $error.set('Free users can only create 1 card. Upgrade to Premium for up to 5 cards.');
            return { success: false, error: 'Free plan limit reached' };
        }

        if (isPremium && currentCards.length >= 5) {
            $error.set('Premium users can create up to 5 cards.');
            return { success: false, error: 'Premium plan limit reached' };
        }

        // Validate required fields
        if (!cardData.firstName || !cardData.lastName || !cardData.email) {
            $error.set('First name, last name, and email are required');
            return { success: false, error: 'Missing required fields' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            // Ensure user profile exists before creating card
            const profileResult = await ensureProfileExists(userId, cardData.email);
            if (!profileResult.success) {
                $error.set(`Profile error: ${profileResult.error}`);
                return { success: false, error: profileResult.error };
            }

            const dbCard = mapCardToDbCard(cardData, userId);

            const { data, error } = await supabase
                .from('cards')
                .insert(dbCard)
                .select()
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const newCard = mapDbCardToCard(data);
            $cards.set([newCard, ...currentCards]);

            return { success: true, data: newCard };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create card';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Update card
    updateCard: async (cardId: number, cardData: Partial<Card>) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const dbCard = mapCardToDbCard(cardData, userId);

            const { data, error } = await supabase
                .from('cards')
                .update({
                    ...dbCard,
                    updated_at: new Date().toISOString()
                })
                .eq('id', cardId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const updatedCard = mapDbCardToCard(data);
            const cards = $cards.get();
            const updatedCards = cards.map(card =>
                card.id === cardId ? updatedCard : card
            );
            $cards.set(updatedCards);

            // Update selected card if it's the one being updated
            if ($selectedCard.get()?.id === cardId) {
                $selectedCard.set(updatedCard);
            }

            return { success: true, data: updatedCard };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update card';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Delete card
    deleteCard: async (cardId: number) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const { error } = await supabase
                .from('cards')
                .delete()
                .eq('id', cardId)
                .eq('user_id', userId);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const cards = $cards.get();
            const updatedCards = cards.filter(card => card.id !== cardId);
            $cards.set(updatedCards);

            // Clear selected card if it was deleted
            if ($selectedCard.get()?.id === cardId) {
                $selectedCard.set(null);
            }

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete card';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Get card by ID (public access for sharing)
    getCard: async (cardId: number) => {
        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('id', cardId)
                .eq('is_active', true)
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const card = mapDbCardToCard(data);
            return { success: true, data: card };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get card';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Toggle card active status
    toggleCardStatus: async (cardId: number) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const cards = $cards.get();
            const card = cards.find(c => c.id === cardId);
            if (!card) {
                $error.set('Card not found');
                return { success: false, error: 'Card not found' };
            }

            const { data, error } = await supabase
                .from('cards')
                .update({
                    is_active: !card.isActive,
                    updated_at: new Date().toISOString()
                })
                .eq('id', cardId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const updatedCard = mapDbCardToCard(data);
            const updatedCards = cards.map(c =>
                c.id === cardId ? updatedCard : c
            );
            $cards.set(updatedCards);

            return { success: true, data: updatedCard };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to toggle card status';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Record card scan
    recordScan: async (cardId: number, scanData?: any) => {
        try {
            const { error } = await supabase
                .from('scans')
                .insert({
                    card_id: cardId,
                    scanned_at: new Date().toISOString(),
                    location: scanData?.location,
                    device_info: scanData?.deviceInfo,
                    referrer: scanData?.referrer,
                    ip_address: scanData?.ipAddress
                });

            if (error) {
                console.error('Failed to record scan:', error);
                return { success: false, error: error.message };
            }

            // Update scan count in local state
            const cards = $cards.get();
            const updatedCards = cards.map(card =>
                card.id === cardId
                    ? { ...card, scanCount: (card.scanCount || 0) + 1 }
                    : card
            );
            $cards.set(updatedCards);

            return { success: true };
        } catch (error) {
            console.error('Failed to record scan:', error);
            return { success: false, error: 'Failed to record scan' };
        }
    },

    // Set selected card
    setSelectedCard: (card: Card | null) => {
        $selectedCard.set(card);
    },

    // Clear error
    clearError: () => {
        $error.set(null);
    }
};