import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function PublicCard() {
    const { handle } = useParams();
    const [card, setCard] = useState<any>(null);
    const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', industry:'' });

    useEffect(()=>{ (async()=>{
        const { data } = await supabase.from('cards').select('*').eq('handle', handle).eq('is_public', true).single();
        setCard(data);
        // fire analytics (Edge Function)
        fetch('/functions/v1/track_scan', {  // Vercel proxy or Supabase function URL (see step 8)
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ card_id: data.id, referrer: document.referrer })
        }).catch(()=>{});
    })(); }, [handle]);

    if (!card) return <div className="p-6">Not found</div>;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        // we need the owner user_id; fetch via the card itself (server-side write alternative is an edge function).
        const { error } = await supabase.from('connections').insert({
            user_id: card.user_id, card_id: card.id, ...form, source:'form'
        });
        if (error) alert(error.message); else alert('Thanks! Saved.');
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">{card.first_name} {card.last_name}</h1>
                <p className="text-sm text-gray-600">{card.title} • {card.industry}</p>
            </header>

            {card.bio && <p>{card.bio}</p>}

            <section className="space-y-1">
                {card.phone && <div>📞 {card.phone}</div>}
                {card.email && <div>✉️ {card.email}</div>}
                {card.address && <div>📍 {card.address}</div>}
            </section>

            {/* Custom links */}
            <section className="space-y-2">
                {(card.custom_links||[]).map((l:any,i:number)=>(
                    <a key={i} className="underline block" href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a>
                ))}
            </section>

            {/* Contact form -> connections */}
            <form onSubmit={submit} className="space-y-2 border-t pt-4">
                <h3 className="font-medium">Share your details</h3>
                <input className="border w-full px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                <input className="border w-full px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
                <input className="border w-full px-3 py-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
                <input className="border w-full px-3 py-2" placeholder="Company" value={form.company} onChange={e=>setForm({...form, company:e.target.value})}/>
                <input className="border w-full px-3 py-2" placeholder="Industry" value={form.industry} onChange={e=>setForm({...form, industry:e.target.value})}/>
                <button className="bg-black text-white rounded px-3 py-2">Send</button>
            </form>
        </div>
    );
}