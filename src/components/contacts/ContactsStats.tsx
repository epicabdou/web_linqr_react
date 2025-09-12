import React from 'react';
import { Users, Grid3X3, Building2, TrendingUp } from 'lucide-react';
import { Contact } from '../../types';

interface ContactsStatsProps {
    contacts: Contact[];
}

const ContactsStats: React.FC<ContactsStatsProps> = ({ contacts }) => {
    const totalContacts = contacts.length;
    const recentContacts = contacts.filter(c =>
        new Date(c.scannedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const cardContacts = contacts.filter(c => c.cardId).length;
    const companiesCount = new Set(contacts.map(c => c.company).filter(Boolean)).size;

    const stats = [
        {
            label: 'Total Contacts',
            value: totalContacts,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            change: `+${recentContacts} this week`
        },
        {
            label: 'From Cards',
            value: cardContacts,
            icon: Grid3X3,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            change: `${Math.round((cardContacts / totalContacts) * 100) || 0}% of total`
        },
        {
            label: 'Companies',
            value: companiesCount,
            icon: Building2,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            change: 'Unique organizations'
        },
        {
            label: 'This Week',
            value: recentContacts,
            icon: TrendingUp,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
            change: 'New connections'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                <IconComponent className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.change}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ContactsStats;