import React from 'react';
import {
    CreditCard,
    Crown,
    Calendar,
    Download,
    AlertCircle,
    Check,
    Zap
} from 'lucide-react';
import Button from '../ui/Button';

interface BillingSettingsProps {
    isPremium: boolean;
    onUpgrade: () => void;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({
                                                             isPremium,
                                                             onUpgrade
                                                         }) => {
    const handleDownloadInvoice = (invoiceId: string) => {
        console.log('Download invoice:', invoiceId);
        // Implement invoice download logic
    };

    const handleUpdatePayment = () => {
        console.log('Update payment method');
        // Implement payment method update logic
    };

    const handleCancelSubscription = () => {
        if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
            console.log('Cancel subscription');
            // Implement subscription cancellation logic
        }
    };

    const freeFeatures = [
        '1 digital business card',
        'Basic analytics (7 days)',
        '3 custom links',
        'Standard templates',
        'Email support'
    ];

    const premiumFeatures = [
        'Up to 5 digital cards',
        'Unlimited analytics',
        'Unlimited custom links',
        'Premium templates',
        'White-label profiles',
        'Physical card ordering',
        'Priority support',
        'Advanced insights',
        'Custom branding'
    ];

    const mockInvoices = [
        { id: 'inv_001', date: '2024-01-15', amount: '$9.99', status: 'paid' },
        { id: 'inv_002', date: '2023-12-15', amount: '$9.99', status: 'paid' },
        { id: 'inv_003', date: '2023-11-15', amount: '$9.99', status: 'paid' }
    ];

    if (!isPremium) {
        return (
            <div className="space-y-8">
                {/* Current Plan */}
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <CreditCard className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">Free Plan</h4>
                                    <p className="text-gray-600">Perfect for getting started</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">$0</p>
                                <p className="text-sm text-gray-500">per month</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h5 className="font-medium text-gray-900 mb-3">What's included:</h5>
                                <ul className="space-y-2">
                                    {freeFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upgrade Section */}
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Upgrade to Premium</h3>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">Premium Plan</h4>
                                    <p className="text-gray-600">Unlock all features and grow your network</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">$9.99</p>
                                <p className="text-sm text-gray-500">per month</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h5 className="font-medium text-gray-900 mb-3">Premium features:</h5>
                                <ul className="space-y-2">
                                    {premiumFeatures.slice(0, 5).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <Zap className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-900 mb-3">And much more:</h5>
                                <ul className="space-y-2">
                                    {premiumFeatures.slice(5).map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <Zap className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Button
                            onClick={onUpgrade}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                        >
                            Upgrade to Premium - $9.99/month
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Current Subscription */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                                <Crown className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-xl font-semibold text-gray-900">Premium Plan</h4>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                        Active
                                    </span>
                                </div>