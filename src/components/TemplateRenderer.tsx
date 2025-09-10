import React from 'react';
import { getTemplate } from '@/templates';
import type { CardViewModel, ProfileViewModel } from '@/templates/viewmodels';

export function RenderCardTemplate({ templateKey, vm }:{ templateKey: string; vm: CardViewModel }) {
    const t = getTemplate(templateKey);
    if (!t || t.kind !== 'card') return <div>Template not found</div>;
    const Cmp = t.component as React.FC<CardViewModel>;
    return <Cmp {...vm} />;
}

export function RenderProfileTemplate({ templateKey, vm }:{ templateKey: string; vm: ProfileViewModel }) {
    const t = getTemplate(templateKey);
    if (!t || t.kind !== 'profile') return <div>Template not found</div>;
    const Cmp = t.component as React.FC<ProfileViewModel>;
    return <Cmp {...vm} />;
}