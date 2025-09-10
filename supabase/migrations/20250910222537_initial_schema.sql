-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE card_template AS ENUM ('modern', 'classic', 'minimal', 'professional', 'creative');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE physical_card_type AS ENUM ('basic', 'custom', 'premium', 'eco-friendly');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
                                 id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
                                 email TEXT NOT NULL,
                                 first_name TEXT,
                                 last_name TEXT,
                                 avatar_url TEXT,
                                 is_premium BOOLEAN DEFAULT FALSE,
                                 subscription_id TEXT,
                                 preferences JSONB DEFAULT '{"theme": "light", "notifications": true, "profileVisibility": "public"}'::jsonb,
                                 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE public.cards (
                              id BIGSERIAL PRIMARY KEY,
                              user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                              first_name TEXT NOT NULL,
                              last_name TEXT NOT NULL,
                              title TEXT,
                              industry TEXT,
                              bio TEXT,
                              photo_url TEXT,
                              phone TEXT,
                              email TEXT NOT NULL,
                              address TEXT,
                              social_media JSONB DEFAULT '{}'::jsonb,
                              custom_links JSONB DEFAULT '[]'::jsonb,
                              template card_template DEFAULT 'modern',
                              is_active BOOLEAN DEFAULT TRUE,
                              scan_count INTEGER DEFAULT 0,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE public.contacts (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                                 card_id BIGINT REFERENCES public.cards(id) ON DELETE SET NULL,
                                 first_name TEXT NOT NULL,
                                 last_name TEXT NOT NULL,
                                 email TEXT,
                                 phone TEXT,
                                 company TEXT,
                                 position TEXT,
                                 notes TEXT,
                                 tags TEXT[] DEFAULT '{}',
                                 scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                 location JSONB,
                                 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table for analytics
CREATE TABLE public.scans (
                              id BIGSERIAL PRIMARY KEY,
                              card_id BIGINT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
                              scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
                              scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                              location JSONB,
                              device_info JSONB,
                              referrer TEXT,
                              ip_address INET
);

-- Create physical_orders table
CREATE TABLE public.physical_orders (
                                        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                                        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
                                        card_id BIGINT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
                                        type physical_card_type NOT NULL,
                                        quantity INTEGER NOT NULL CHECK (quantity > 0),
                                        status order_status DEFAULT 'pending',
                                        tracking_number TEXT,
                                        shipping_address JSONB NOT NULL,
                                        order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                        estimated_delivery TIMESTAMP WITH TIME ZONE,
                                        total_amount DECIMAL(10,2) NOT NULL,
                                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cards_user_id ON public.cards(user_id);
CREATE INDEX idx_cards_is_active ON public.cards(is_active);
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_tags ON public.contacts USING GIN(tags);
CREATE INDEX idx_scans_card_id ON public.scans(card_id);
CREATE INDEX idx_scans_scanned_at ON public.scans(scanned_at);
CREATE INDEX idx_physical_orders_user_id ON public.physical_orders(user_id);
CREATE INDEX idx_physical_orders_status ON public.physical_orders(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physical_orders_updated_at BEFORE UPDATE ON public.physical_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
INSERT INTO public.profiles (id, email, first_name, last_name)
VALUES (
           NEW.id,
           NEW.email,
           NEW.raw_user_meta_data->>'first_name',
           NEW.raw_user_meta_data->>'last_name'
       );
RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment scan count
CREATE OR REPLACE FUNCTION public.increment_scan_count()
RETURNS TRIGGER AS $
BEGIN
UPDATE public.cards
SET scan_count = scan_count + 1,
    updated_at = NOW()
WHERE id = NEW.card_id;
RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to increment scan count when scan is recorded
CREATE TRIGGER on_scan_recorded
    AFTER INSERT ON public.scans
    FOR EACH ROW EXECUTE FUNCTION public.increment_scan_count();