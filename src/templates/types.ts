export type TemplateKind = 'card' | 'profile';

export type TemplateDescriptor = {
    key: string;               // "card/free-1"
    kind: TemplateKind;
    name: string;              // "Minimal"
    premium?: boolean;         // false by default
    previewUrl?: string;       // small PNG in /public or Supabase Storage
    component: React.FC<any>;  // (props depend on kind, we keep it loose here)
    description?: string;
};