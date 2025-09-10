import React from 'react';
import PricingCard from './ui/PricingCard';

interface UpgradeViewProps {
    setIsPremium: (premium: boolean) => void;
}

const UpgradeView: React.FC<UpgradeViewProps> = ({ setIsPremium }) => {
    const freePlan = {
        title: 'Free',
        price: '$0',
        features: [
            '1 digital card',
            '3 custom links',
            '3 templates',
            'Basic analytics (1 week)'
        ],
        buttonText: 'Current Plan',
        buttonClass: 'bg-gray-200 text-gray-700 cursor-not-allowed',
        disabled: true,
        popular: false
    };

    const premiumPlan = {
        title: 'Premium',
        price: '$9.99',
        features: [
            'Up to 5 digital cards',
            'Unlimited custom links',
            'All templates',
            'Unlimited analytics',
            'White-label profiles',
            'Physical cards',
            'Priority support'
        ],
        buttonText: 'Upgrade Now',
        buttonClass: 'bg-white text-purple-600 hover:bg-gray-100',
        onClick: () => setIsPremium(true),
        disabled: false,
        popular: true
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
                <p className="text-xl text-gray-600">Unlock all features and create unlimited cards</p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PricingCard {...freePlan} />
                <PricingCard {...premiumPlan} />
            </div>

            {/* Additional Benefits */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Upgrade to Premium?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scale Your Network</h3>
                        <p className="text-gray-600">Create multiple cards for different purposes and reach more people.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Deep Analytics</h3>
                        <p className="text-gray-600">Track your networking success with unlimited analytics and insights.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎨</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Branding</h3>
                        <p className="text-gray-600">White-label profiles and premium templates for a professional look.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeView;