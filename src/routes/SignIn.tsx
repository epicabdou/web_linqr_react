import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message); else setSent(true);
    };

    return (
        <div className="min-h-dvh grid place-items-center p-6">
            <form onSubmit={onSubmit} className="max-w-sm w-full space-y-3">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <input className="w-full border rounded px-3 py-2"
                       placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <button className="w-full bg-black text-white rounded px-3 py-2">Send magic link</button>
                {sent && <p>Check your inbox.</p>}
            </form>
        </div>
    );
}