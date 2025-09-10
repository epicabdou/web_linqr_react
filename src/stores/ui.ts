import { atom } from 'nanostores';

export type Theme = 'system' | 'light' | 'dark';

export const theme = atom<Theme>('system');        // current selection (user pref)
export const effectiveTheme = atom<'light'|'dark'>('light'); // actually applied

const LS_KEY = 'linqr:theme';

function systemPref(): 'light'|'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(next: 'light'|'dark') {
    const root = document.documentElement;
    root.classList.remove('light','dark');
    root.classList.add(next);
    // Optional: set meta theme-color for mobile
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) meta.content = next === 'dark' ? '#0a0a0a' : '#ffffff';
    effectiveTheme.set(next);
}

export function initTheme() {
    // load saved selection
    const saved = (localStorage.getItem(LS_KEY) as Theme | null) || 'system';
    theme.set(saved);
    applyTheme(saved === 'system' ? systemPref() : saved);

    // react to store changes
    theme.subscribe((sel) => {
        localStorage.setItem(LS_KEY, sel);
        applyTheme(sel === 'system' ? systemPref() : sel);
    });

    // live react to OS changes when in system mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
        if (theme.get() === 'system') applyTheme(systemPref());
    };
    mq.addEventListener?.('change', onChange);
}
