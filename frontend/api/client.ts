// Simple API client for making requests to the backend
// This file contains helper functions to call our NestJS backend API

// Get the API base URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get the authentication token from localStorage
function getAuthToken(): string | null {
    // Check if we're in the browser (not server-side)
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Main API client function - makes fetch requests with authentication
export async function apiClient(
    endpoint: string,
    options: RequestInit = {}
): Promise<any> {
    // Get the token for authentication
    const token = getAuthToken();

    // Build the full URL
    const url = `${API_URL}${endpoint}`;

    // Set up headers with authentication if token exists
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    // Add Authorization header if we have a token
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Add Content-Type for JSON requests
    if (options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    try {
        // Make the fetch request
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Handle non-JSON responses (like file downloads)
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        }

        // Parse JSON response
        const data = await response.json();

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        // Re-throw the error so the caller can handle it
        throw error;
    }
}

// Helper function for GET requests
export async function get(endpoint: string): Promise<any> {
    return apiClient(endpoint, {
        method: 'GET',
    });
}

// Helper function for POST requests
export async function post(endpoint: string, data: any): Promise<any> {
    return apiClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Helper function for PATCH requests
export async function patch(endpoint: string, data: any): Promise<any> {
    return apiClient(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

// Helper function for DELETE requests
export async function del(endpoint: string): Promise<any> {
    return apiClient(endpoint, {
        method: 'DELETE',
    });
}

// Helper function for file uploads (multipart/form-data)
export async function uploadFile(endpoint: string, formData: FormData): Promise<any> {
    const token = getAuthToken();
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = {};

    // Add Authorization header if we have a token
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type - browser will set it automatically with boundary

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}
