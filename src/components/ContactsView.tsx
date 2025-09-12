import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import {
    $contacts,
    $filteredContacts,
    $loading,
    $error,
    $searchQuery,
    $selectedTags,
    $allTags,
    contactsActions
} from '../stores/contactsStore';
import Loading from './ui/Loading';
import Modal from './ui/Modal';
import ContactForm from './contacts/ContactForm';
import { Contact } from '../types';

// Import the new components
import ContactsHeader from './contacts/ContactsHeader';
import ContactsStats from './contacts/ContactsStats';
import ContactsSearchFilter from './contacts/ContactsSearchFilter';
import ContactsGrid from './contacts/ContactsGrid';
import { ErrorState } from './contacts/ContactsEmptyStates';

const ContactsView: React.FC = () => {
    const contacts = useStore($contacts);
    const filteredContacts = useStore($filteredContacts);
    const loading = useStore($loading);
    const error = useStore($error);
    const searchQuery = useStore($searchQuery);
    const selectedTags = useStore($selectedTags);
    const allTags = useStore($allTags);

    const [showContactForm, setShowContactForm] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Fetch contacts on mount
    useEffect(() => {
        contactsActions.fetchContacts();
    }, []);

    const handleCreateContact = () => {
        setEditingContact(null);
        setShowContactForm(true);
    };

    const handleEditContact = (contact: Contact) => {
        setEditingContact(contact);
        setShowContactForm(true);
    };

    const handleDeleteContact = async (contactId: number) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            await contactsActions.deleteContact(contactId);
        }
    };

    const handleSaveContact = async (contactData: Partial<Contact>) => {
        if (editingContact) {
            await contactsActions.updateContact(editingContact.id, contactData);
        } else {
            await contactsActions.createContact(contactData);
        }
        setShowContactForm(false);
        setEditingContact(null);
    };

    const handleTagToggle = (tag: string) => {
        const isSelected = selectedTags.includes(tag);
        if (isSelected) {
            contactsActions.removeSelectedTag(tag);
        } else {
            contactsActions.addSelectedTag(tag);
        }
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export contacts');
    };

    const handleImport = () => {
        // TODO: Implement import functionality
        console.log('Import contacts');
    };

    const handleRetryLoad = () => {
        contactsActions.fetchContacts();
    };

    if (loading && contacts.length === 0) {
        return <Loading centered text="Loading your network..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <ContactsHeader
                onCreateContact={handleCreateContact}
                onExport={handleExport}
                onImport={handleImport}
            />

            {/* Stats Section - Only show if we have contacts */}
            {contacts.length > 0 && (
                <ContactsStats contacts={contacts} />
            )}

            {/* Search and Filters - Only show if we have contacts */}
            {contacts.length > 0 && (
                <ContactsSearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={contactsActions.setSearchQuery}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    selectedTags={selectedTags}
                    allTags={allTags}
                    onTagToggle={handleTagToggle}
                    onClearFilters={contactsActions.clearFilters}
                />
            )}

            {/* Error State */}
            {error && (
                <ErrorState
                    error={error}
                    onRetry={handleRetryLoad}
                />
            )}

            {/* Main Content - Contacts Grid/List */}
            <ContactsGrid
                contacts={contacts}
                filteredContacts={filteredContacts}
                viewMode={viewMode}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
                onCreateContact={handleCreateContact}
                onClearFilters={contactsActions.clearFilters}
                onImport={handleImport}
            />

            {/* Contact Form Modal */}
            {showContactForm && (
                <Modal
                    isOpen={showContactForm}
                    onClose={() => {
                        setShowContactForm(false);
                        setEditingContact(null);
                    }}
                    title={editingContact ? 'Edit Contact' : 'Add New Contact'}
                    size="lg"
                >
                    <ContactForm
                        contact={editingContact}
                        onSave={handleSaveContact}
                        onCancel={() => {
                            setShowContactForm(false);
                            setEditingContact(null);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ContactsView;