import React from 'react';

interface ContactInfoProps {
    icon: string;
    value: string;
    href?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, value, href }) => {
    const content = (
        <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium text-base">{icon}</span>
            <span className="ml-2 truncate">{value}</span>
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {content}
            </a>
        );
    }

    return content;
};

export default ContactInfo;