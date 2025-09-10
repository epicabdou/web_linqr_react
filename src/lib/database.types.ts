export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    first_name: string | null
                    last_name: string | null
                    avatar_url: string | null
                    is_premium: boolean
                    subscription_id: string | null
                    created_at: string
                    updated_at: string
                    preferences: Json | null
                }
                Insert: {
                    id: string
                    email: string
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    is_premium?: boolean
                    subscription_id?: string | null
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    is_premium?: boolean
                    subscription_id?: string | null
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                }
            }
            cards: {
                Row: {
                    id: number
                    user_id: string
                    first_name: string
                    last_name: string
                    title: string | null
                    industry: string | null
                    bio: string | null
                    photo_url: string | null
                    phone: string | null
                    email: string
                    address: string | null
                    social_media: Json | null
                    custom_links: Json | null
                    template: string
                    is_active: boolean
                    scan_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    first_name: string
                    last_name: string
                    title?: string | null
                    industry?: string | null
                    bio?: string | null
                    photo_url?: string | null
                    phone?: string | null
                    email: string
                    address?: string | null
                    social_media?: Json | null
                    custom_links?: Json | null
                    template?: string
                    is_active?: boolean
                    scan_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    first_name?: string
                    last_name?: string
                    title?: string | null
                    industry?: string | null
                    bio?: string | null
                    photo_url?: string | null
                    phone?: string | null
                    email?: string
                    address?: string | null
                    social_media?: Json | null
                    custom_links?: Json | null
                    template?: string
                    is_active?: boolean
                    scan_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            contacts: {
                Row: {
                    id: number
                    user_id: string
                    card_id: number | null
                    first_name: string
                    last_name: string
                    email: string | null
                    phone: string | null
                    company: string | null
                    position: string | null
                    notes: string | null
                    tags: string[] | null
                    scanned_at: string
                    location: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    card_id?: number | null
                    first_name: string
                    last_name: string
                    email?: string | null
                    phone?: string | null
                    company?: string | null
                    position?: string | null
                    notes?: string | null
                    tags?: string[] | null
                    scanned_at?: string
                    location?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    card_id?: number | null
                    first_name?: string
                    last_name?: string
                    email?: string | null
                    phone?: string | null
                    company?: string | null
                    position?: string | null
                    notes?: string | null
                    tags?: string[] | null
                    scanned_at?: string
                    location?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            scans: {
                Row: {
                    id: number
                    card_id: number
                    scanned_by: string | null
                    scanned_at: string
                    location: Json | null
                    device_info: Json | null
                    referrer: string | null
                    ip_address: string | null
                }
                Insert: {
                    id?: number
                    card_id: number
                    scanned_by?: string | null
                    scanned_at?: string
                    location?: Json | null
                    device_info?: Json | null
                    referrer?: string | null
                    ip_address?: string | null
                }
                Update: {
                    id?: number
                    card_id?: number
                    scanned_by?: string | null
                    scanned_at?: string
                    location?: Json | null
                    device_info?: Json | null
                    referrer?: string | null
                    ip_address?: string | null
                }
            }
            physical_orders: {
                Row: {
                    id: string
                    user_id: string
                    card_id: number
                    type: string
                    quantity: number
                    status: string
                    tracking_number: string | null
                    shipping_address: Json
                    order_date: string
                    estimated_delivery: string | null
                    total_amount: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    card_id: number
                    type: string
                    quantity: number
                    status?: string
                    tracking_number?: string | null
                    shipping_address: Json
                    order_date?: string
                    estimated_delivery?: string | null
                    total_amount: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    card_id?: number
                    type?: string
                    quantity?: number
                    status?: string
                    tracking_number?: string | null
                    shipping_address?: Json
                    order_date?: string
                    estimated_delivery?: string | null
                    total_amount?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            card_template: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative'
            order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
            physical_card_type: 'basic' | 'custom' | 'premium' | 'eco-friendly'
        }
    }
}