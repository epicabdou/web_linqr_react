import React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import Button from '../ui/Button';

interface ContactsHeaderProps {
    onCreateContact: () => void;
    onExport?: () => void;
    onImport?: () => void;
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({
                                                           onCreateContact,
                                                           onExport,
                                                           onImport
                                                       }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Network</h1>
                <p className="text-gray-600">
                    Manage your connections and grow your professional relationships
                </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {onExport && (
                    <Button variant="outline" icon={Download} onClick={onExport}>
                        Export
                    </Button>
                )}
                {onImport && (
                    <Button variant="outline" icon={Upload} onClick={onImport}>
                        Import
                    </Button>
                )}
                <Button onClick={onCreateContact} icon={Plus}>
                    Add Contact
                </Button>
            </div>
        </div>
    );
};

export default ContactsHeader;