import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function fromDaysAgo(n:number){ const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString(); }

export default function Dashboard() {
    const [metrics, setMetrics] = useState<{ scans:number, uniques:number }|null>(null);

    useEffect(()=>{ (async()=>{
        const since = fromDaysAgo(7);
        // get latest card
        const { data: card } = await supabase.from('cards').select('id').limit(1).maybeSingle();
        if (!card?.id) return;
        // scans count
        const { data: scans } = await supabase.from('scans').select('id, ip_hash').gte('created_at', since).eq('card_id', card.id);
        const uniques = new Set((scans||[]).map((s:any)=>s.ip_hash)).size;
        setMetrics({ scans: scans?.length||0, uniques });
    })(); }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            {metrics && (
                <div className="grid grid-cols-2 max-w-md gap-3">
                    <div className="border rounded p-3">
                        <div className="text-sm text-gray-600">Scans (7 days)</div>
                        <div className="text-2xl font-semibold">{metrics.scans}</div>
                    </div>
                    <div className="border rounded p-3">
                        <div className="text-sm text-gray-600">Unique visitors</div>
                        <div className="text-2xl font-semibold">{metrics.uniques}</div>
                    </div>
                </div>
            )}
        </div>
    );
}