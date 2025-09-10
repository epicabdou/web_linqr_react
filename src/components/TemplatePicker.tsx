import { listTemplates } from '@/templates';
import type { TemplateDescriptor } from '@/templates/types';

export function TemplatePicker({
                                   kind, isPremium, currentKey, onSelect
                               }: { kind: 'card'|'profile'; isPremium: boolean; currentKey?: string; onSelect: (key: string) => void }) {
    const templates = listTemplates(kind, isPremium);
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((t: TemplateDescriptor) => {
                const active = t.key === currentKey;
                return (
                    <button
                        key={t.key}
                        onClick={()=>onSelect(t.key)}
                        className={`border rounded overflow-hidden text-left ${active ? 'ring-2 ring-black' : ''}`}
                    >
                        {t.previewUrl ? <img src={t.previewUrl} alt="" className="w-full aspect-video object-cover" /> : (
                            <div className="w-full aspect-video grid place-items-center text-sm text-neutral-500">No preview</div>
                        )}
                        <div className="p-2">
                            <div className="font-medium">{t.name}</div>
                            {t.premium && <div className="text-xs text-amber-600">Premium</div>}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
