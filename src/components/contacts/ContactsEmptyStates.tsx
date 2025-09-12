import React from 'react';
import { Users, Plus, Upload, Search } from 'lucide-react';
import Button from '../ui/Button';

interface EnhancedEmptyStateProps {
    onCreateContact: () => void;
    onImport?: () => void;
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
                                                                          onCreateContact,
                                                                          onImport
                                                                      }) => (
    <div className="text-center py-16">
        <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Users className="h-16 w-16 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="h-5 w-5 text-yellow-800" />
            </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Building Your Network</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your professional connections are valuable. Add contacts to keep track of the people you meet
            and strengthen your networking efforts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onCreateContact} icon={Plus} size="lg">
                Add Your First Contact
            </Button>
            {onImport && (
                <Button variant="outline" icon={Upload} size="lg" onClick={onImport}>
                    Import Contacts
                </Button>
            )}
        </div>
    </div>
);

interface NoResultsStateProps {
    onClearFilters: () => void;
}

export const NoResultsState: React.FC<NoResultsStateProps> = ({ onClearFilters }) => (
    <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
        <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <Button
            variant="outline"
            onClick={onClearFilters}
        >
            Clear Filters
        </Button>
    </div>
);

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-sm text-red-800 underline hover:no-underline"
                    >
                        Try again
                    </button>
                )}
            </div>
        </div>
    </div>
);