import React from 'react';
import { Users } from 'lucide-react';
import PlaceholderView from './ui/PlaceholderView';

interface ContactsViewProps {
    setCurrentView: (view: string) => void;
}

const ContactsView: React.FC<ContactsViewProps> = ({ setCurrentView }) => (
    <PlaceholderView
        title="Contacts"
        icon={Users}
        description="Manage your professional network and connections"
        actionButton={{
            text: "Create First Card",
            onClick: () => setCurrentView('cards')
        }}
    />
);

export default ContactsView;