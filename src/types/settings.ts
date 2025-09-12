// types/settings.ts - Type definitions
export interface SettingsTab {
    id: 'profile' | 'account' | 'security' | 'notifications' | 'subscription' | 'preferences';
    label: string;
    icon: React.ComponentType<any>;
    description: string;
    badge?: string; // For showing notifications or status
}

export interface SettingsViewProps {
    defaultTab?: SettingsTab['id'];
    onTabChange?: (tab: SettingsTab['id']) => void;
}