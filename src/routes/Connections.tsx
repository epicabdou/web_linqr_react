import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Connections() {
    const [rows, setRows] = useState<any[]>([]);
    useEffect(()=>{ (async()=>{
        const { data } = await supabase.from('connections').select('*').order('created_at',{ascending:false});
        setRows(data||[]);
    })(); }, []);
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Connections</h1>
            <div className="space-y-2">
                {rows.map(r=>(
                    <div key={r.id} className="border rounded p-3">
                        <div className="font-medium">{r.name || r.email || r.phone || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{r.company} {r.industry && `• ${r.industry}`}</div>
                        <div className="text-xs">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}