import { atom, computed } from 'nanostores';
import { Contact } from '@/types';
import supabase from '../lib/supabase';
import { $userId } from './authStore';

// Contacts state atoms
export const $contacts = atom<Contact[]>([]);
export const $selectedContact = atom<Contact | null>(null);
export const $loading = atom<boolean>(false);
export const $error = atom<string | null>(null);
export const $searchQuery = atom<string>('');
export const $selectedTags = atom<string[]>([]);

// Computed values
export const $contactsCount = computed($contacts, (contacts) => contacts.length);

export const $filteredContacts = computed(
    [$contacts, $searchQuery, $selectedTags],
    (contacts, searchQuery, selectedTags) => {
        let filtered = contacts;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(contact =>
                contact.firstName.toLowerCase().includes(query) ||
                contact.lastName.toLowerCase().includes(query) ||
                contact.email?.toLowerCase().includes(query) ||
                contact.company?.toLowerCase().includes(query) ||
                contact.position?.toLowerCase().includes(query)
            );
        }

        // Filter by selected tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(contact =>
                selectedTags.some(tag => contact.tags.includes(tag))
            );
        }

        return filtered;
    }
);

export const $allTags = computed($contacts, (contacts) => {
    const tagsSet = new Set<string>();
    contacts.forEach(contact => {
        contact.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
});

export const $recentContacts = computed($contacts, (contacts) =>
    contacts
        .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
        .slice(0, 5)
);

// Database mapping helpers
const mapDbContactToContact = (dbContact: any): Contact => ({
    id: dbContact.id,
    firstName: dbContact.first_name,
    lastName: dbContact.last_name,
    email: dbContact.email,
    phone: dbContact.phone,
    company: dbContact.company,
    position: dbContact.position,
    notes: dbContact.notes,
    tags: dbContact.tags || [],
    cardId: dbContact.card_id,
    scannedAt: new Date(dbContact.scanned_at),
    location: dbContact.location
});

const mapContactToDbContact = (contact: Partial<Contact>, userId: string) => ({
    user_id: userId,
    card_id: contact.cardId,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    position: contact.position,
    notes: contact.notes,
    tags: contact.tags,
    scanned_at: contact.scannedAt?.toISOString() || new Date().toISOString(),
    location: contact.location
});

// Contacts actions
export const contactsActions = {
    // Fetch user's contacts
    fetchContacts: async () => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('user_id', userId)
                .order('scanned_at', { ascending: false });

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const contacts = data.map(mapDbContactToContact);
            $contacts.set(contacts);

            return { success: true, data: contacts };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Create new contact
    createContact: async (contactData: Partial<Contact>) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const dbContact = mapContactToDbContact(contactData, userId);

            const { data, error } = await supabase
                .from('contacts')
                .insert(dbContact)
                .select()
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const newContact = mapDbContactToContact(data);
            $contacts.set([newContact, ...$contacts.get()]);

            return { success: true, data: newContact };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create contact';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Update contact
    updateContact: async (contactId: number, contactData: Partial<Contact>) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const dbContact = mapContactToDbContact(contactData, userId);

            const { data, error } = await supabase
                .from('contacts')
                .update(dbContact)
                .eq('id', contactId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const updatedContact = mapDbContactToContact(data);
            const contacts = $contacts.get();
            const updatedContacts = contacts.map(contact =>
                contact.id === contactId ? updatedContact : contact
            );
            $contacts.set(updatedContacts);

            // Update selected contact if it's the one being updated
            if ($selectedContact.get()?.id === contactId) {
                $selectedContact.set(updatedContact);
            }

            return { success: true, data: updatedContact };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update contact';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Delete contact
    deleteContact: async (contactId: number) => {
        const userId = $userId.get();
        if (!userId) {
            $error.set('User not authenticated');
            return { success: false, error: 'User not authenticated' };
        }

        try {
            $loading.set(true);
            $error.set(null);

            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contactId)
                .eq('user_id', userId);

            if (error) {
                $error.set(error.message);
                return { success: false, error: error.message };
            }

            const contacts = $contacts.get();
            const updatedContacts = contacts.filter(contact => contact.id !== contactId);
            $contacts.set(updatedContacts);

            // Clear selected contact if it was deleted
            if ($selectedContact.get()?.id === contactId) {
                $selectedContact.set(null);
            }

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
            $error.set(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            $loading.set(false);
        }
    },

    // Add tags to contact
    addTagsToContact: async (contactId: number, newTags: string[]) => {
        const contacts = $contacts.get();
        const contact = contacts.find(c => c.id === contactId);

        if (!contact) {
            $error.set('Contact not found');
            return { success: false, error: 'Contact not found' };
        }

        const uniqueTags = Array.from(new Set([...contact.tags, ...newTags]));
        return contactsActions.updateContact(contactId, { tags: uniqueTags });
    },

    // Remove tags from contact
    removeTagsFromContact: async (contactId: number, tagsToRemove: string[]) => {
        const contacts = $contacts.get();
        const contact = contacts.find(c => c.id === contactId);

        if (!contact) {
            $error.set('Contact not found');
            return { success: false, error: 'Contact not found' };
        }

        const updatedTags = contact.tags.filter(tag => !tagsToRemove.includes(tag));
        return contactsActions.updateContact(contactId, { tags: updatedTags });
    },

    // Search and filter actions
    setSearchQuery: (query: string) => {
        $searchQuery.set(query);
    },

    setSelectedTags: (tags: string[]) => {
        $selectedTags.set(tags);
    },

    addSelectedTag: (tag: string) => {
        const currentTags = $selectedTags.get();
        if (!currentTags.includes(tag)) {
            $selectedTags.set([...currentTags, tag]);
        }
    },

    removeSelectedTag: (tag: string) => {
        const currentTags = $selectedTags.get();
        $selectedTags.set(currentTags.filter(t => t !== tag));
    },

    clearFilters: () => {
        $searchQuery.set('');
        $selectedTags.set([]);
    },

    // Set selected contact
    setSelectedContact: (contact: Contact | null) => {
        $selectedContact.set(contact);
    },

    // Clear error
    clearError: () => {
        $error.set(null);
    }
};