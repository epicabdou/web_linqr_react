import React from 'react';
import { Settings, Save } from 'lucide-react';
import Button from '../ui/Button';

interface SettingsHeaderProps {
    title?: string;
    description?: string;
    hasUnsavedChanges?: boolean;
    onSave?: () => void;
    isSaving?: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
                                                           title = "Settings",
                                                           description = "Manage your account preferences and settings",
                                                           hasUnsavedChanges = false,
                                                           onSave,
                                                           isSaving = false
                                                       }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                <p className="text-gray-600">{description}</p>
            </div>

            {hasUnsavedChanges && onSave && (
                <div className="mt-4 sm:mt-0">
                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        icon={Save}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SettingsHeader;