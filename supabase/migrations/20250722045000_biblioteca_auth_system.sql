-- Location: supabase/migrations/20250722045000_biblioteca_auth_system.sql
-- Biblioteca Digital - Authentication & User Management System

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended');

-- 2. User Profiles Table (Critical intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id TEXT UNIQUE NOT NULL,  -- Custom user ID like ADMIN-001, USER-001
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    status public.user_status DEFAULT 'active'::public.user_status,
    active_loans INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::TEXT = required_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT public.has_role('admin')
$$;

CREATE OR REPLACE FUNCTION public.generate_user_id(user_role TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    prefix TEXT;
    next_number INTEGER;
    new_user_id TEXT;
BEGIN
    -- Set prefix based on role
    prefix := CASE WHEN user_role = 'admin' THEN 'ADMIN' ELSE 'USER' END;
    
    -- Get next number for this prefix
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(user_id FROM LENGTH(prefix) + 2) AS INTEGER)
    ), 0) + 1
    INTO next_number
    FROM public.user_profiles
    WHERE user_id LIKE prefix || '-%';
    
    -- Generate new user ID
    new_user_id := prefix || '-' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN new_user_id;
END;
$$;

-- Function for automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    user_role_value TEXT;
    generated_user_id TEXT;
BEGIN
    -- Get role from metadata, default to 'user'
    user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
    
    -- Generate custom user ID
    generated_user_id := public.generate_user_id(user_role_value);
    
    -- Insert user profile
    INSERT INTO public.user_profiles (
        id, 
        user_id, 
        email, 
        full_name, 
        role,
        status
    )
    VALUES (
        NEW.id,
        generated_user_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        user_role_value::public.user_role,
        'active'::public.user_status
    );
    
    RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RLS Policies
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "admins_manage_all_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Mock Data for Testing
DO $$
DECLARE
    admin_auth_id UUID := gen_random_uuid();
    user1_auth_id UUID := gen_random_uuid();
    user2_auth_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@biblioteca.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "María González", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'carlos.rodriguez@email.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Carlos Rodríguez", "role": "user"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'ana.martinez@email.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ana Martínez", "role": "user"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Note: User profiles will be automatically created by the trigger

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- 8. Cleanup Function for Testing
CREATE OR REPLACE FUNCTION public.cleanup_auth_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs for test accounts
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email IN ('admin@biblioteca.com', 'carlos.rodriguez@email.com', 'ana.martinez@email.com');

    -- Delete user profiles first (children before parents)
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

    RAISE NOTICE 'Test data cleanup completed successfully';

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents cleanup: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;