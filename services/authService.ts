import { User } from '../types';
import { supabase } from './supabaseClient';
import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Maps the user object from Supabase Auth to the application's internal User type.
 * It extracts custom metadata like `name` and `officerId`.
 * @param supabaseUser The user object from a Supabase session.
 * @returns An application-specific User object.
 */
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): User => {
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || 'Officer',
        officerId: supabaseUser.user_metadata?.officerId || 'N/A',
    };
};

/**
 * Attempts to log in a user with their email and password using Supabase Auth.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise that resolves with the user object on success or an error on failure.
 */
export const login = async (email: string, password?: string): Promise<{ user: User | null; error: AuthError | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
    });

    if (error) {
        return { user: null, error };
    }
    
    if (data.user) {
        return { user: mapSupabaseUserToAppUser(data.user), error: null };
    }
    
    // @ts-ignore
    return { user: null, error: { message: "Login failed: No user data returned." } };
};

/**
 * Creates a new user account using Supabase Auth.
 * Stores the user's full name and officer ID in the user_metadata field.
 * @param name The user's full name.
 * @param email The user's email address.
 * @param officerId The user's unique officer ID.
 * @param password The user's chosen password.
 * @returns A promise that resolves with the new user object on success or an error on failure.
 */
export const signup = async (name: string, email: string, officerId: string, password?: string): Promise<{ user: User | null; error: AuthError | null }> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password: password || '',
        options: {
            data: {
                name,
                officerId,
            },
        },
    });
    
    if (error) {
        return { user: null, error };
    }

    if (data.user) {
        return { user: mapSupabaseUserToAppUser(data.user), error: null };
    }

    // @ts-ignore
    return { user: null, error: { message: "Signup failed: No user data returned." } };
};

/**
 * Logs the current user out by terminating their Supabase session.
 * @returns A promise that resolves when the sign-out is complete.
 */
export const logout = async (): Promise<{ error: AuthError | null }> => {
    return await supabase.auth.signOut();
};