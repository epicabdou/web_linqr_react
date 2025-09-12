import React from 'react';
import { Search, Filter, Grid3X3, List, Tag } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ContactsSearchFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    selectedTags: string[];
    allTags: string[];
    onTagToggle: (tag: string) => void;
    onClearFilters: () => void;
}

const ContactsSearchFilter: React.FC<ContactsSearchFilterProps> = ({
                                                                       searchQuery,
                                                                       onSearchChange,
                                                                       viewMode,
                                                                       onViewModeChange,
                                                                       showFilters,
                                                                       onToggleFilters,
                                                                       selectedTags,
                                                                       allTags,
                                                                       onTagToggle,
                                                                       onClearFilters
                                                                   }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <Input
                        placeholder="Search by name, email, company, or notes..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon={Search}
                        fullWidth
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Grid View"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === 'list'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="List View"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>

                {/* Filter Toggle */}
                <Button
                    variant="outline"
                    onClick={onToggleFilters}
                    icon={Filter}
                >
                    Filters {selectedTags.length > 0 && `(${selectedTags.length})`}
                </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Filter by Tags</h4>
                            {allTags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => onTagToggle(tag)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Tag className="h-3 w-3 inline mr-1" />
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No tags available</p>
                            )}
                        </div>
                    </div>

                    {selectedTags.length > 0 && (
                        <button
                            onClick={onClearFilters}
                            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactsSearchFilter;