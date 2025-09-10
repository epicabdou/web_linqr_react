import React from 'react';
import type { ProfileViewModel } from '../viewmodels';

export const ProfileFree1: React.FC<ProfileViewModel> = ({ displayName, username, avatarUrl, company, card }) => {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <header className="flex items-center gap-4">
                {avatarUrl && <img src={avatarUrl} className="h-16 w-16 rounded-full object-cover" />}
                <div>
                    <h1 className="text-2xl font-semibold">{displayName || username}</h1>
                    {company && <div className="text-sm text-neutral-500">{company}</div>}
                </div>
            </header>

            <main className="mt-6">
                {card && (
                    <div className="border rounded-lg p-4">
                        {/* Reuse card template inside if desired, or show key info */}
                        <div className="font-medium">{card.firstName} {card.lastName}</div>
                        {card.title && <div className="text-sm text-neutral-500">{card.title}</div>}
                        {(card.customLinks?.length ?? 0) > 0 && (
                            <div className="mt-3 space-y-2">
                                {card.customLinks!.map((l, i) => (
                                    <a key={i} href={l.url} target="_blank" className="underline">{l.label || l.url}</a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
