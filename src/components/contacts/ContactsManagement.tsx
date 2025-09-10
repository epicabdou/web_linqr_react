import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Search, Filter, Plus, Tag, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
    $contacts,
    $filteredContacts,
    $loading,
    $error,
    $searchQuery,
    $selectedTags,
    $allTags,
    contactsActions
} from '../../stores/contactsStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';
import { Contact } from '../../types';

interface ContactsManagementProps {
    setCurrentView: (view: string) => void;
}

const ContactsManagement: React.FC<ContactsManagementProps> = ({ setCurrentView }) => {
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

    if (loading && contacts.length === 0) {
        return <Loading centered text="Loading contacts..." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your professional network ({filteredContacts.length} contacts)
                    </p>
                </div>
                <Button
                    onClick={handleCreateContact}
                    icon={Plus}
                >
                    Add Contact
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <Input
                            placeholder="Search contacts by name, email, or company..."
                            value={searchQuery}
                            onChange={(e) => contactsActions.setSearchQuery(e.target.value)}
                            icon={Search}
                            fullWidth
                        />
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        icon={Filter}
                    >
                        Filters {selectedTags.length > 0 && `(${selectedTags.length})`}
                    </Button>

                    {/* Clear Filters */}
                    {(searchQuery || selectedTags.length > 0) && (
                        <Button
                            variant="ghost"
                            onClick={contactsActions.clearFilters}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        selectedTags.includes(tag)
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                    }`}
                                >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                </button>
                            ))}
                            {allTags.length === 0 && (
                                <p className="text-sm text-gray-500">No tags available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={contactsActions.clearError}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {/* Contacts Grid */}
            {filteredContacts.length === 0 ? (
                <EmptyState
                    title={contacts.length === 0 ? "No contacts yet" : "No contacts found"}
                    description={
                        contacts.length === 0
                            ? "Start building your professional network by adding contacts"
                            : "Try adjusting your search or filter criteria"
                    }
                    buttonText={contacts.length === 0 ? "Add Your First Contact" : "Clear Filters"}
                    onClick={contacts.length === 0 ? handleCreateContact : contactsActions.clearFilters}
                    icon={Users}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContacts.map(contact => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onEdit={handleEditContact}
                            onDelete={handleDeleteContact}
                        />
                    ))}
                </div>
            )}

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

export default ContactsManagement;