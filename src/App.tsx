import { useEffect } from 'react';
import { initTheme } from '@/stores/ui';

export default function App() {
    useEffect(() => { initTheme(); }, []);
    // ... your layout / nav / outlet
    return <div className="min-h-dvh"><Outlet/></div>;
}