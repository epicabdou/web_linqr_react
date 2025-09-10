import React from 'react';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonClass: string;
    onClick?: () => void;
    disabled?: boolean;
    popular?: boolean;
    description?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
                                                     title,
                                                     price,
                                                     features,
                                                     buttonText,
                                                     buttonClass,
                                                     onClick,
                                                     disabled = false,
                                                     popular = false,
                                                     description
                                                 }) => (
    <div className={`${
        popular ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' : 'bg-white'
    } p-8 rounded-xl shadow-lg ${popular ? '' : 'border'} relative transition-transform hover:scale-105`}>
        {popular && (
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Popular
            </div>
        )}

        <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            {description && (
                <p className={`text-sm mb-4 ${popular ? 'text-white/80' : 'text-gray-600'}`}>
                    {description}
                </p>
            )}
            <div className="mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className={`text-lg font-normal ${popular ? 'opacity-80' : 'text-gray-500'}`}>
          /month
        </span>
            </div>
        </div>

        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <span className={`mr-3 ${popular ? 'text-white' : 'text-green-500'}`}>✓</span>
                    <span className="text-sm">{feature}</span>
                </li>
            ))}
        </ul>

        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${buttonClass} ${
                disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
            {buttonText}
        </button>
    </div>
);

export default PricingCard;