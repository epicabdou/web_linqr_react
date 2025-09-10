import React from 'react';
import { BarChart3 } from 'lucide-react';
import PlaceholderView from './ui/PlaceholderView';

interface AnalyticsViewProps {
    setCurrentView: (view: string) => void;
    isPremium: boolean;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ setCurrentView, isPremium }) => (
    <PlaceholderView
        title="Analytics"
        icon={BarChart3}
        description={isPremium
            ? "Track your networking success with detailed analytics"
            : "Upgrade to Premium to unlock detailed analytics and insights"
        }
        actionButton={{
            text: isPremium ? "View Dashboard" : "Upgrade to Premium",
            onClick: () => setCurrentView(isPremium ? 'dashboard' : 'upgrade')
        }}
    />
);

export default AnalyticsView;