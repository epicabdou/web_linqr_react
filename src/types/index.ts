export interface Card {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
    industry: string;
    bio: string;
    photo: string | null;
    phone: string;
    email: string;
    address: string;
    socialMedia: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
        github?: string;
        website?: string;
    };
    customLinks: Array<{
        name: string;
        url: string;
    }>;
    template: string;
    isActive?: boolean;
    scanCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;
    notes?: string;
    tags: string[];
    cardId?: number;
    scannedAt: Date;
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
}

export interface Analytics {
    totalScans: number;
    weeklyScans: number;
    monthlyScans: number;
    topLocations: Array<{
        city: string;
        country: string;
        count: number;
    }>;
    scansByDate: Array<{
        date: string;
        count: number;
    }>;
    deviceTypes: Array<{
        type: string;
        count: number;
    }>;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isPremium: boolean;
    subscriptionId?: string;
    createdAt: Date;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
        profileVisibility: 'public' | 'private';
    };
}

export interface PhysicalCard {
    id: string;
    cardId: number;
    type: 'basic' | 'custom' | 'premium' | 'eco-friendly';
    quantity: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    orderDate: Date;
    trackingNumber?: string;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface Scan {
    id: number;
    cardId: number;
    scannedBy?: string;
    scannedAt: Date;
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    deviceInfo?: {
        type: string;
        browser: string;
        os: string;
    };
    referrer?: string;
    ipAddress?: string;
}