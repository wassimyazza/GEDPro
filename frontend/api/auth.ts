// Authentication API functions
// Functions to call the backend authentication endpoints

import { post, get } from './client';

// Login with email and password
// Returns an access token on success
export async function login(email: string, password: string): Promise<any> {
    return post('/auth/login', {
        email,
        password,
    });
}

// Register a new user
// Returns an access token on success
export async function register(email: string, password: string, role: string): Promise<any> {
    return post('/auth/register', {
        email,
        password,
        role,
    });
}

// Get the current authenticated user
export async function getCurrentUser(): Promise<any> {
    return get('/auth/me');
}
