// Authentication utilities for managing tokens and user session
// Simple implementations suitable for a school project

// Save the JWT token to localStorage
export function saveToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

// Get the JWT token from localStorage
export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Remove the JWT token from localStorage (logout)
export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

// Check if user is authenticated (has a token)
export function isAuthenticated(): boolean {
    const token = getToken();
    return token !== null && token !== '';
}

// Simple JWT decoder - extracts payload without verification
// This is OK for a school project since we trust our backend
function decodeJWT(token: string): any {
    try {
        // JWT has 3 parts separated by dots: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];
        // Replace URL-safe characters
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        // Decode from base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Get the user's role from the JWT token
export function getUserRole(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
        return null;
    }

    // Return the role from the token payload
    return decoded.role || null;
}

// Get the user's email from the JWT token
export function getUserEmail(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
        return null;
    }

    // Return the email from the token payload
    return decoded.email || null;
}

// Get the user's ID from the JWT token
export function getUserId(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
        return null;
    }

    // Return the user ID from the token payload
    return decoded.sub || decoded.id || null;
}
