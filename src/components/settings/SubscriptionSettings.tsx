// SubscriptionSettings.tsx
import React from 'react';
import { Crown, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface SubscriptionSettingsProps {
    isPremium: boolean;
    user: any;
}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ isPremium, user }) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription & Billing</h2>

            {isPremium ? (
                <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Premium Plan</h3>
                                    <p className="text-gray-600">Active subscription</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">$9.99</p>
                                <p className="text-sm text-gray-600">per month</p>
                            </div>
                        </div>
                    </div>

                    {/* Billing Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Next billing date:</span>
                                <span className="font-medium">January 15, 2025</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Payment method:</span>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">•••• •••• •••• 4242</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Billing email:</span>
                                <span className="font-medium">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Features */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Premium Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">5 Digital Cards</h4>
                                <p className="text-sm text-gray-600">Create multiple cards for different purposes</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Advanced Analytics</h4>
                                <p className="text-sm text-gray-600">Detailed insights and reports</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Custom Branding</h4>
                                <p className="text-sm text-gray-600">Remove LinQR branding</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Priority Support</h4>
                                <p className="text-sm text-gray-600">24/7 premium customer support</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6 border-t">
                        <Button variant="outline">
                            Update Payment Method
                        </Button>
                        <Button variant="outline">
                            Download Invoices
                        </Button>
                        <Button variant="destructive">
                            Cancel Subscription
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Free Plan */}
                    <div className="bg-gray-50 border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Free Plan</h3>
                                <p className="text-gray-600">Current plan</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">$0</p>
                                <p className="text-sm text-gray-600">forever</p>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Prompt */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
                                <p className="text-blue-100 mb-4">
                                    Unlock advanced features and create up to 5 digital cards
                                </p>
                                <ul className="text-sm text-blue-100 space-y-1">
                                    <li>• 5 Digital Cards (vs 1 free)</li>
                                    <li>• Advanced Analytics & Reports</li>
                                    <li>• Custom Branding Options</li>
                                    <li>• Priority Customer Support</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">$9.99</div>
                                <div className="text-blue-100">per month</div>
                                <Button
                                    variant="secondary"
                                    className="mt-4 bg-white text-blue-600 hover:bg-blue-50"
                                >
                                    Upgrade Now
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Free Plan Features */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">1 Digital Card</h4>
                                <p className="text-sm text-gray-600">Create one professional digital business card</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Basic Analytics</h4>
                                <p className="text-sm text-gray-600">View basic scan statistics</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Contact Management</h4>
                                <p className="text-sm text-gray-600">Organize your network connections</p>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Standard Support</h4>
                                <p className="text-sm text-gray-600">Email support during business hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionSettings;