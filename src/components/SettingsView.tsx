import React from 'react';
import { Settings } from 'lucide-react';
import PlaceholderView from './ui/PlaceholderView';

interface SettingsViewProps {
    setCurrentView: (view: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ setCurrentView }) => (
    <PlaceholderView
        title="Settings"
        icon={Settings}
        description="Customize your LinQR experience and manage your account"
        actionButton={{
            text: "Go to Dashboard",
            onClick: () => setCurrentView('dashboard')
        }}
    />
);

export default SettingsView;