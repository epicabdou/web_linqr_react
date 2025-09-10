import React from 'react';
import type { CardViewModel } from '../viewmodels';

export const CardFree1: React.FC<CardViewModel> = ({
                                                       firstName, lastName, title, industry, bio, photoUrl, phone, email, address, customLinks, social, url
                                                   }) => {
    return (
        <div className="w-full max-w-xl border rounded-lg p-4 bg-white dark:bg-neutral-900 dark:border-neutral-800">
            <div className="flex items-center gap-4">
                {photoUrl && <img src={photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />}
                <div>
                    <div className="text-xl font-semibold">{firstName} {lastName}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{title} {industry && `• ${industry}`}</div>
                </div>
            </div>

            {bio && <p className="mt-3 text-sm">{bio}</p>}

            <div className="mt-4 grid gap-1 text-sm">
                {phone && <div>📞 {phone}</div>}
                {email && <div>✉️ {email}</div>}
                {address && <div>📍 {address}</div>}
            </div>

            {(customLinks?.length ?? 0) > 0 && (
                <div className="mt-4 space-y-2">
                    {customLinks!.map((l, i) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="block underline">
                            {l.label || l.url}
                        </a>
                    ))}
                </div>
            )}

            {/* Social (simple as text for MVP) */}
            {social && Object.keys(social).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {Object.entries(social).map(([k, v]) => (
                        <a key={k} href={v} target="_blank" className="underline">{k}</a>
                    ))}
                </div>
            )}

            {/* Footer (branding or share) */}
            <div className="mt-5 text-xs text-neutral-500">
                <a href={url} className="underline">View online</a>
            </div>
        </div>
    );
};
