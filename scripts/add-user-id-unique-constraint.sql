-- Add unique constraint to user_id column in plik_user_profiles table
-- This is required for the upsert operation to work with onConflict: "user_id"

ALTER TABLE public.plik_user_profiles 
ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
