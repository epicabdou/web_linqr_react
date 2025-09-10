export type Social = Record<string, string>; // { linkedin, twitter, instagram, ... }

export type CardViewModel = {
    firstName?: string;
    lastName?: string;
    title?: string;
    industry?: string;
    bio?: string;
    photoUrl?: string;
    phone?: string;
    email?: string;
    address?: string;
    social?: Social;
    customLinks?: { label?: string; url: string }[];
    brand?: { logoUrl?: string; name?: string; showBranding?: boolean }; // for white-label gating later
    theme: 'light' | 'dark';  // from effectiveTheme store
    url: string;               // public URL (share/QR)
};

export type ProfileViewModel = {
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    company?: string;
    // may include a primary card view (or highlight links)
    card?: CardViewModel | null;
    theme: 'light' | 'dark';
    url: string;
};
