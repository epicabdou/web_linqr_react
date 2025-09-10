import type { TemplateDescriptor } from './types';
import { CardFree1 } from './card/CardFree1';
import { CardFree2 } from './card/CardFree2';
import { CardFree3 } from './card/CardFree3';
import { CardPremiumModern } from './card/CardPremiumModern';
import { ProfileFree1 } from './profile/ProfileFree1';
import { ProfileFree2 } from './profile/ProfileFree2';
import { ProfileFree3 } from './profile/ProfileFree3';
import { ProfilePremiumShowcase } from './profile/ProfilePremiumShowcase';

export const TEMPLATES: TemplateDescriptor[] = [
    // Card (3 free + 1 premium sample)
    { key: 'card/free-1', kind: 'card', name: 'Minimal', component: CardFree1, previewUrl: '/previews/card-free-1.png' },
    { key: 'card/free-2', kind: 'card', name: 'Accent Bar', component: CardFree2, previewUrl: '/previews/card-free-2.png' },
    { key: 'card/free-3', kind: 'card', name: 'Compact', component: CardFree3, previewUrl: '/previews/card-free-3.png' },
    { key: 'card/premium-modern', kind: 'card', name: 'Modern Pro', premium: true, component: CardPremiumModern, previewUrl: '/previews/card-premium-modern.png' },

    // Profile (3 free + 1 premium sample)
    { key: 'profile/free-1', kind: 'profile', name: 'Clean', component: ProfileFree1, previewUrl: '/previews/profile-free-1.png' },
    { key: 'profile/free-2', kind: 'profile', name: 'Sidebar', component: ProfileFree2, previewUrl: '/previews/profile-free-2.png' },
    { key: 'profile/free-3', kind: 'profile', name: 'Hero', component: ProfileFree3, previewUrl: '/previews/profile-free-3.png' },
    { key: 'profile/premium-showcase', kind: 'profile', name: 'Showcase Pro', premium: true, component: ProfilePremiumShowcase, previewUrl: '/previews/profile-premium-showcase.png' },
];

export function listTemplates(kind: 'card'|'profile', isPremium: boolean) {
    return TEMPLATES.filter(t => t.kind === kind && (isPremium || !t.premium));
}

export function getTemplate(key: string) {
    return TEMPLATES.find(t => t.key === key);
}