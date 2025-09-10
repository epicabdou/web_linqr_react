import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { theme, Theme } from '@/stores/ui';
import { saveProfileTheme, loadProfileTheme } from '@/lib/profileTheme';
import { supabase } from '@/lib/supabase';

type CardLite = { id: string; handle: string; is_public: boolean };

export default function Settings() {
    const t = useStore(theme);
    const [savingTheme, setSavingTheme] = useState(false);
    const [card, setCard] = useState<CardLite | null>(null);
    const [visSaving, setVisSaving] = useState(false);

    useEffect(() => {
        // hydrate theme from profile if available
        loadProfileTheme().catch(()=>{});
        // fetch the user’s (single) card for MVP
        (async () => {
            const { data } = await supabase
                .from('cards')
                .select('id, handle, is_public')
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle();
            setCard(data as CardLite | null);
        })();
    }, []);

    const onThemeChange = async (next: Theme) => {
        theme.set(next);
        setSavingTheme(true);
        try { await saveProfileTheme(next); } finally { setSavingTheme(false); }
    };

    const toggleVisibility = async () => {
        if (!card) return;
        setVisSaving(true);
        try {
            const { data, error } = await supabase
                .from('cards')
                .update({ is_public: !card.is_public })
                .eq('id', card.id)
                .select('id, handle, is_public')
                .single();
            if (error) alert(error.message);
            else setCard(data as CardLite);
        } finally {
            setVisSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-semibold">Settings</h1>

            {/* Theme */}
            <section className="border rounded p-4 space-y-3">
                <h2 className="font-medium">Theme</h2>
                <div className="flex gap-2 flex-wrap">
                    {(['system','light','dark'] as Theme[]).map(opt => (
                        <button
                            key={opt}
                            onClick={() => onThemeChange(opt)}
                            className={`px-3 py-1.5 border rounded ${t===opt ? 'bg-black text-white' : ''}`}
                            disabled={savingTheme}
                            aria-pressed={t===opt}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500">
                    Your choice syncs to this device and your profile.
                </p>
            </section>

            {/* Visibility */}
            <section className="border rounded p-4 space-y-3">
                <h2 className="font-medium">Profile visibility</h2>
                {!card ? (
                    <p className="text-sm text-gray-600">No card yet.</p>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Public card</div>
                                <div className="text-sm text-gray-600">
                                    {card.is_public
                                        ? <>Your card is publicly viewable at <a className="underline" href={`/c/${card.handle}`} target="_blank">/c/{card.handle}</a></>
                                        : 'Your card is hidden from the public.'}
                                </div>
                            </div>
                            <button
                                onClick={toggleVisibility}
                                className="px-3 py-1.5 border rounded"
                                disabled={visSaving}
                            >
                                {card.is_public ? 'Hide' : 'Make public'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Hiding your card disables access to the URL and prevents new scans.
                        </p>
                    </>
                )}
            </section>
        </div>
    );
}
