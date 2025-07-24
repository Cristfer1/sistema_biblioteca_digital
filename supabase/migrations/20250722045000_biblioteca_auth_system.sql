-- Location: supabase/migrations/20250722045000_biblioteca_auth_system.sql
-- Biblioteca Digital - Authentication & User Management System

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended');

-- 1.a Biblioteca: Custom Types
CREATE TYPE public.biblioteca_tipo AS ENUM ('Revista', 'Libro', 'Tesis', 'Otros');
CREATE TYPE public.biblioteca_categoria AS ENUM ('Tecnología', 'Ciencia', 'Educación', 'Otros');
CREATE TYPE public.biblioteca_almacenamiento AS ENUM ('Virtual', 'Físico');

-- 1.b Biblioteca: Table
CREATE TABLE public.biblioteca_material (
    id SERIAL PRIMARY KEY,
    isbn TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    tipo public.biblioteca_tipo NOT NULL,
    categoria public.biblioteca_categoria NOT NULL,
    almacenamiento public.biblioteca_almacenamiento NOT NULL,
    volumen INTEGER,
    anio_publicacion INTEGER,
    paginas TEXT,
    numero_copias INTEGER DEFAULT 1,
    palabras_clave TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

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

    -- Mock data for Biblioteca Materiales
    INSERT INTO public.biblioteca_material (isbn, titulo, autor, tipo, categoria, almacenamiento, volumen, anio_publicacion, paginas, numero_copias, palabras_clave) VALUES
    -- 1
    ('978-1-2345-6789-0', 'Gamified mobile application as a didactic strategy', 'Luana P. Barreto, Valentine Barth et al.', 'Revista', 'Tecnología', 'Virtual', 239, 2024, '437-444', 1, 'Gamification, Mobile application, Pregnant women'),
    -- 2
    ('978-1-2345-6790-6', 'Attacking more fun than defending? — Observation of Decision-Making Insights: Assess Value Perception in Job Toilet and App Cycle - Reducing electronic and textile wastes', 'Valentin Barth et al.', 'Revista', 'Tecnología', 'Virtual', 246, 2024, '3148–3157', 1, 'Gamification, Security Awareness, Information Security'),
    -- 3
    ('978-1-2345-6791-3', 'AppCycle - Reducing electronic and textile wastes', 'João Teixeira et al.', 'Revista', 'Ciencia', 'Virtual', 242, 2024, '874–880', 1, 'PLS-SEM, Agroforestry Products, Sustainable Consumption, waste, textile waste, APP'),
    -- 4
    ('978-1-2345-6792-0', 'Tools to support managerial decision', 'Miroslav Žilka et al.', 'Revista', 'Tecnología', 'Virtual', 239, 2024, '2126–2134', 1, 'Data-driven decision making, SMEs, gamification'),
    -- 5
    ('978-1-2345-6793-7', 'Preserving Indonesian Culture in the Digital Age', 'W.P. Aldo Arista', 'Revista', 'Ciencia', 'Virtual', 232, 2024, '416–425', 1, 'Cultural appropriation, Augmented Reality'),
    -- 6
    ('978-1-2345-6794-4', 'Game-based Activity Design in Primary School Student Business Computer Simulations in Educational', 'Pumudu A. Ferna', 'Revista', 'Tecnología', 'Virtual', 239, 2024, '365–363', 1, 'Learning style, Game-based learning, Generation Alpha'),
    -- 7
    ('978-1-2345-6795-1', 'Mobile Applications and Cloud Computing in Healthcare', 'Milneva-Vlad Dani', 'Revista', 'Tecnología', 'Virtual', 225, 2023, '4006–4014', 1, 'Business simulations, Higher education'),
    -- 8
    ('978-1-2345-6796-8', 'Information System Approaches in Cybersecurity', 'Prassbyo Adi Witt', 'Revista', 'Tecnología', 'Virtual', 236, 2024, '1372–1379', 1, 'Mobile applications, Cloud computing, Healthcare'),
    -- 9
    ('978-1-2345-6797-5', 'Japanese language learning game "Miryoku" using Google Composer', 'Rio Wibawa et al.', 'Revista', 'Tecnología', 'Virtual', 216, 2023, '547–556', 1, 'Speech Recognition, Japanese Language, Android App'),
    -- 10
    ('978-1-2345-6798-2', 'Educational game to raise awareness of illegal animal', 'Jonathan William', 'Revista', 'Ciencia', 'Virtual', 245, 2024, '337–345', 1, 'Animal, Game, Wildlife, Awareness'),
    -- 11
    ('978-1-2345-6799-9', 'Applying the Nominal Group Technique for the Corse', 'Ana Filipa Rosa', 'Revista', 'Ciencia', 'Virtual', 219, 2023, '1240–1248', 1, 'Wealth, Conceptual validation, Nominal group technique'),
    -- 12
    ('978-1-2345-6800-2', 'Additive applications in entrepreneurship: A systematic review', 'Ulli Abshar', 'Revista', 'Tecnología', 'Virtual', 245, 2024, '409–418', 1, 'Web application, Entrepreneurship, Literature review'),
    -- 13
    ('978-1-2345-6801-9', 'Harnessing Data Science for Debt Reduction', 'Caetano Alfafin', 'Revista', 'Ciencia', 'Virtual', 242, 2024, '138–144', 1, 'Debt, Financial Literacy, Structural Equation Model'),
    -- 14
    ('978-1-2345-6802-6', 'Mixed Reality for Green Marketing Strategies', 'Konrad Biercew', 'Revista', 'Tecnología', 'Virtual', 246, 2024, '5488–5497', 1, 'Green Marketing, Bibliometric analysis, Mixed Reality'),
    -- 15
    ('978-1-2345-6803-3', 'Communication Characteristics in Co-creative Modell', 'Yumiko Nara et al.', 'Revista', 'Ciencia', 'Virtual', 246, 2024, '5478–5487', 1, 'Co-creative modeling, Communication, Policy decision'),
    -- 16
    ('978-1-2345-6804-0', 'LM-Assisted Qualitative Data Analysis', 'Aksvarya Adeseyi', 'Revista', 'Tecnología', 'Virtual', 257, 2025, '60–67', 1, 'LLMs, Qualitative Data, Privacy, Gamification'),
    -- 17
    ('978-1-2345-6805-7', 'Affordances of MOOP platforms for learning', 'Yanglin Du et al.', 'Revista', 'Tecnología', 'Virtual', 242, 2024, '1394–1401', 1, 'MOOP, Online learning, Collaborative learning'),
    -- 18
    ('978-1-2345-6806-4', 'Big Data and Labour Markets', 'Leija Turujja et al.', 'Revista', 'Ciencia', 'Virtual', 217, 2023, '526–535', 1, 'Big Data, Labour Market, Systematic Literature Review'),
    -- 19
    ('978-1-2345-6807-1', 'Perspectives and applications of virtual reality in high', 'Danielle Nunes', 'Revista', 'Tecnología', 'Virtual', 238, 2024, '962–967', 1, 'Virtual reality, Higher education, Latin America'),
    -- 20
    ('978-1-2345-6808-8', 'Physical and digital worlds: implications and opportunities', 'Fabio De Felice', 'Revista', 'Ciencia', 'Virtual', 217, 2023, '1744–1754', 1, 'Metaverse, Immersive Internet, AR, VR'),
    -- 21
    ('978-1-2345-6809-5', 'The use of gamification on cybersecurity awareness', 'Ana Carreiro et al.', 'Revista', 'Tecnología', 'Virtual', 239, 2024, '526–533', 1, 'Gamification, Cybersecurity, Healthcare'),
    -- 22
    ('978-1-2345-6810-1', 'Assessing social cognition using virtual reality in the', 'André Freitas et al.', 'Revista', 'Ciencia', 'Virtual', 256, 2025, '1200–1207', 1, 'Social cognition, Virtual reality, Neurosurgery'),
    -- 23
    ('978-1-2345-6811-8', 'Emotion-Driven Game Adaptation using Facial Recog', 'Adewiya Niko Sí', 'Revista', 'Tecnología', 'Virtual', 245, 2024, '1083–1091', 1, 'Facial Expression, Heart Rate, Game Difficulty'),
    -- 24
    ('978-1-2345-6812-5', 'Innovative teaching methodologies: Keyword-based approach', 'Suppin Claudio', 'Revista', 'Ciencia', 'Virtual', 253, 2025, '2229–2237', 1, 'Teaching methods, Engineering, Digital tools'),
    -- 25
    ('978-1-2345-6813-2', 'Ontological model for intelligent assessment in serious', 'Amery Rijba et al.', 'Revista', 'Tecnología', 'Virtual', 246, 2024, '3158–3167', 1, 'Serious Games, AI, Collaborative Learning');

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
