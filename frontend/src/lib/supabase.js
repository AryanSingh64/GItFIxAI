import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
};

const isPlaceholder = (val) => {
    return !val || val.includes('placeholder') || val.includes('your-supabase');
};

const supabaseUrl = isValidUrl(rawUrl) && !isPlaceholder(rawUrl)
    ? rawUrl
    : 'https://placeholder.supabase.co';

const supabaseAnonKey = rawKey && !isPlaceholder(rawKey)
    ? rawKey
    : 'placeholder-key';

if (isPlaceholder(rawUrl) || isPlaceholder(rawKey) || !isValidUrl(rawUrl)) {
    console.warn('⚠️ Supabase credentials not set or invalid. Auth will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Email/Password Auth ────────────────────────────────────────────────

export const signUpWithEmail = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    });
    if (error) throw error;
    return data;
};

export const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

// ─── OAuth (Google / GitHub) ────────────────────────────────────────────

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`,
        },
    });
    if (error) throw error;
    return data;
};

export const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            scopes: 'repo',
            redirectTo: `${window.location.origin}/dashboard`,
        },
    });
    if (error) throw error;
    return data;
};

// ─── Password Reset ────────────────────────────────────────────────────

export const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    if (error) throw error;
    return data;
};

export const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    if (error) throw error;
    return data;
};

// ─── Session Helpers ───────────────────────────────────────────────────

export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

export const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// ─── GitHub Access Token (for repo operations) ─────────────────────────

export const getGithubProviderToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.provider_token || null;
};
