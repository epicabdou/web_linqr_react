-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$function$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON public.cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_physical_orders_updated_at
    BEFORE UPDATE ON public.physical_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment scan count
CREATE OR REPLACE FUNCTION public.increment_scan_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
UPDATE public.cards
SET scan_count = scan_count + 1,
    updated_at = NOW()
WHERE id = NEW.card_id;
RETURN NEW;
END;
$function$;

-- Trigger to increment scan count when scan is recorded
CREATE TRIGGER on_scan_recorded
    AFTER INSERT ON public.scans
    FOR EACH ROW EXECUTE FUNCTION public.increment_scan_count();