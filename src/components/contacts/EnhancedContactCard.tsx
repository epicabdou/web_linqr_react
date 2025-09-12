import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Star, Tag, Edit, Trash2 } from 'lucide-react';
import { Contact } from '../../types';

interface EnhancedContactCardProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (contactId: number) => void;
    viewMode: 'grid' | 'list';
}

const EnhancedContactCard: React.FC<EnhancedContactCardProps> = ({
                                                                     contact,
                                                                     onEdit,
                                                                     onDelete,
                                                                     viewMode
                                                                 }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isStarred, setIsStarred] = useState(false);

    const handleMenuAction = (action: 'edit' | 'delete') => {
        setShowMenu(false);
        if (action === 'edit') {
            onEdit(contact);
        } else {
            onDelete(contact.id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const ActionMenu: React.FC = () => (
        <>
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border z-20 min-w-[140px]">
                <button
                    onClick={() => handleMenuAction('edit')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg transition-colors"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contact
                </button>
                <button
                    onClick={() => handleMenuAction('delete')}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </button>
            </div>
            <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
            />
        </>
    );

    const ContactAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
        const sizeClasses = {
            sm: 'w-10 h-10 text-sm',
            md: 'w-12 h-12 text-lg',
            lg: 'w-16 h-16 text-xl'
        };

        return (
            <div className="relative">
                <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
                    {contact.firstName?.[0]}{contact.lastName?.[0]}
                </div>
                {contact.cardId && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                )}
            </div>
        );
    };

    const ContactTags: React.FC<{ maxTags?: number }> = ({ maxTags = 3 }) => (
        <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, maxTags).map(tag => (
                <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                </span>
            ))}
            {contact.tags.length > maxTags && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    +{contact.tags.length - maxTags} more
                </span>
            )}
        </div>
    );

    const QuickActions: React.FC = () => (
        <div className="flex items-center space-x-2">
            {contact.email && (
                <a
                    href={`mailto:${contact.email}`}
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    title="Send Email"
                >
                    <Mail className="h-4 w-4 text-blue-600" />
                </a>
            )}
            {contact.phone && (
                <a
                    href={`tel:${contact.phone}`}
                    className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                    title="Call"
                >
                    <Phone className="h-4 w-4 text-green-600" />
                </a>
            )}
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <ContactAvatar />

                        {/* Contact Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {contact.firstName} {contact.lastName}
                                </h3>
                                <button
                                    onClick={() => setIsStarred(!isStarred)}
                                    className={`p-1 rounded-full transition-colors ${
                                        isStarred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                                    }`}
                                >
                                    <Star className="h-4 w-4" fill={isStarred ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                {contact.position && (
                                    <span className="flex items-center">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {contact.position}
                                        {contact.company && ` at ${contact.company}`}
                                    </span>
                                )}
                                {contact.location && (
                                    <span className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {contact.location.city}, {contact.location.country}
                                    </span>
                                )}
                            </div>
                        </div>

                        <QuickActions />

                        {/* Tags */}
                        {contact.tags.length > 0 && (
                            <div className="max-w-xs">
                                <ContactTags maxTags={2} />
                            </div>
                        )}
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>

                        {showMenu && <ActionMenu />}
                    </div>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 group hover:-translate-y-1">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-20 relative">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setIsStarred(!isStarred)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            isStarred ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/20 text-white hover:bg-yellow-500/20 hover:text-yellow-300'
                        }`}
                    >
                        <Star className="h-4 w-4" fill={isStarred ? 'currentColor' : 'none'} />
                    </button>
                </div>
                {contact.cardId && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        From Card
                    </div>
                )}
            </div>

            {/* Avatar */}
            <div className="relative -mt-8 flex justify-center">
                <ContactAvatar size="lg" />
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {contact.firstName} {contact.lastName}
                    </h3>
                    {contact.position && (
                        <p className="text-sm text-gray-600 mt-1">{contact.position}</p>
                    )}
                    {contact.company && (
                        <p className="text-sm text-gray-500">{contact.company}</p>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                    {contact.email && (
                        <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                            <Mail className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500" />
                            <span className="truncate">{contact.email}</span>
                        </a>
                    )}

                    {contact.phone && (
                        <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors group"
                        >
                            <Phone className="h-4 w-4 mr-2 text-gray-400 group-hover:text-green-500" />
                            <span>{contact.phone}</span>
                        </a>
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
                    <div className="mb-4">
                        <ContactTags />
                    </div>
                )}

                {/* Notes Preview */}
                {contact.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        Added {formatDate(contact.scannedAt)}
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>

                        {showMenu && <ActionMenu />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedContactCard;