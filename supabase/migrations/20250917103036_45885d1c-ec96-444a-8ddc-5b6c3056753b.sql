-- Fix security vulnerability: Restrict profile visibility to own profile only
DROP POLICY IF EXISTS "Users can view all profiles with email protection" ON public.profiles;

CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);