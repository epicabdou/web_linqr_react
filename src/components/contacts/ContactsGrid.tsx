import React from 'react';
import { Contact } from '../../types';
import EnhancedContactCard from './EnhancedContactCard';
import { EnhancedEmptyState, NoResultsState } from './ContactsEmptyStates';

interface ContactsGridProps {
    contacts: Contact[];
    filteredContacts: Contact[];
    viewMode: 'grid' | 'list';
    onEditContact: (contact: Contact) => void;
    onDeleteContact: (contactId: number) => void;
    onCreateContact: () => void;
    onClearFilters: () => void;
    onImport?: () => void;
}

const ContactsGrid: React.FC<ContactsGridProps> = ({
                                                       contacts,
                                                       filteredContacts,
                                                       viewMode,
                                                       onEditContact,
                                                       onDeleteContact,
                                                       onCreateContact,
                                                       onClearFilters,
                                                       onImport
                                                   }) => {
    // No contacts at all - show welcome state
    if (contacts.length === 0) {
        return (
            <EnhancedEmptyState
                onCreateContact={onCreateContact}
                onImport={onImport}
            />
        );
    }

    // Have contacts but none match filters - show no results state
    if (filteredContacts.length === 0) {
        return <NoResultsState onClearFilters={onClearFilters} />;
    }

    // Render contacts grid/list
    return (
        <div className={
            viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
        }>
            {filteredContacts.map(contact => (
                <EnhancedContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={onEditContact}
                    onDelete={onDeleteContact}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
};

export default ContactsGrid;