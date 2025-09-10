import { atom } from 'nanostores';
export const currentUser = atom<null | { id: string; email?: string }>(null);
export const profile = atom<any | null>(null);