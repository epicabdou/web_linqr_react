import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { QRCodeCanvas } from 'qrcode.react';

export default function CardEdit() {
    const [card, setCard] = useState<any>(null);
    useEffect(()=>{ (async()=>{
        const { data } = await supabase.from('cards').select('*').limit(1).single();
        setCard(data);
    })(); }, []);

    const save = async () => {
        const links = (card.custom_links || []).slice(0,3);
        const { error, data } = await supabase.from('cards').update({ ...card, custom_links: links }).eq('id', card.id).select().single();
        if (error) alert(error.message); else setCard(data);
    };

    if (!card) return null;
    const publicUrl = `${location.origin}/c/${card.handle}`;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-semibold">Edit Card</h1>
            <div className="grid gap-3">
                <input className="border px-3 py-2" placeholder="First name" value={card.first_name||''} onChange={e=>setCard({...card, first_name:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Last name" value={card.last_name||''} onChange={e=>setCard({...card, last_name:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Title" value={card.title||''} onChange={e=>setCard({...card, title:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Industry" value={card.industry||''} onChange={e=>setCard({...card, industry:e.target.value})}/>
                <textarea className="border px-3 py-2" placeholder="Bio" value={card.bio||''} onChange={e=>setCard({...card, bio:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Phone" value={card.phone||''} onChange={e=>setCard({...card, phone:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Email" value={card.email||''} onChange={e=>setCard({...card, email:e.target.value})}/>
                <input className="border px-3 py-2" placeholder="Address" value={card.address||''} onChange={e=>setCard({...card, address:e.target.value})}/>
                {/* Custom links (max 3) */}
                <div className="space-y-2">
                    <h3 className="font-medium">Custom Links (max 3)</h3>
                    {(card.custom_links||[]).map((l:any,i:number)=>(
                        <div key={i} className="flex gap-2">
                            <input className="border px-2 py-1 flex-1" placeholder="Label" value={l.label||''}
                                   onChange={e=>{ const arr=[...card.custom_links]; arr[i]={...arr[i], label:e.target.value}; setCard({...card, custom_links:arr}); }} />
                            <input className="border px-2 py-1 flex-1" placeholder="https://..." value={l.url||''}
                                   onChange={e=>{ const arr=[...card.custom_links]; arr[i]={...arr[i], url:e.target.value}; setCard({...card, custom_links:arr}); }} />
                        </div>
                    ))}
                    <button className="border rounded px-2 py-1" onClick={()=>{
                        const arr = (card.custom_links||[]);
                        if (arr.length >= 3) return;
                        setCard({...card, custom_links:[...arr, {label:'', url:''}]});
                    }}>+ Add link</button>
                </div>
            </div>

            <button className="bg-black text-white rounded px-3 py-2" onClick={save}>Save</button>

            <div className="p-4 border rounded space-y-2">
                <div className="text-sm break-all">{publicUrl}</div>
                <QRCodeCanvas id="qr" value={publicUrl} size={128}/>
                <button className="border rounded px-2 py-1" onClick={()=>{
                    const canvas = document.getElementById('qr') as HTMLCanvasElement;
                    const a = document.createElement('a'); a.download = `linqr-${card.handle}.png`; a.href = canvas.toDataURL(); a.click();
                }}>Download QR</button>
            </div>
        </div>
    );
}