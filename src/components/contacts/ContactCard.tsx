import React, { useState } from 'react';
import { User, Mail, Phone, Building, MapPin, Tag, MoreVertical, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Contact } from '../../types';
import Button from '../ui/Button';

interface ContactCardProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (contactId: number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const handleMenuAction = (action: 'edit' | 'delete') => {
        setShowMenu(false);
        if (action === 'edit') {
            onEdit(contact);
        } else if (action === 'delete') {
            onDelete(contact.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-semibold text-sm">
                {getInitials(contact.firstName, contact.lastName)}
              </span>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {contact.firstName} {contact.lastName}
                            </h3>
                            {contact.position && (
                                <p className="text-sm text-gray-600 truncate">{contact.position}</p>
                            )}
                            {contact.company && (
                                <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                            )}
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border z-10 min-w-[120px]">
                                <button
                                    onClick={() => handleMenuAction('edit')}
                                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleMenuAction('delete')}
                                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="px-6 pb-4 space-y-2">
                {contact.email && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-blue-600 transition-colors truncate"
                        >
                            {contact.email}
                        </a>
                    </div>
                )}

                {contact.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {contact.phone}
                        </a>
                    </div>
                )}

                {contact.location && (
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">
              {contact.location.city}, {contact.location.country}
            </span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {contact.tags.length > 0 && (
                <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                            >
                <Tag className="h-3 w-3 mr-1" />
                                {tag}
              </span>
                        ))}
                        {contact.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                +{contact.tags.length - 3} more
              </span>
                        )}
                    </div>
                </div>
            )}

            {/* Notes Preview */}
            {contact.notes && (
                <div className="px-6 pb-4">
                    <div className="flex items-start text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2">{contact.notes}</p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500">
                <span>Added {formatDate(contact.scannedAt)}</span>
                {contact.cardId && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
            From Card
          </span>
                )}
            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
};

export default ContactCard;