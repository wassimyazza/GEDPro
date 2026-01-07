// Forms API functions
// Functions to call the backend forms endpoints

import { get, post, patch, del } from './client';

// Get all forms for the organization
export async function listForms(): Promise<any> {
    return get('/forms');
}

// Get a specific form by ID
export async function getForm(formId: string): Promise<any> {
    return get(`/forms/${formId}`);
}

// Get a published form by public ID (no authentication required)
export async function getPublicForm(publicId: string): Promise<any> {
    // Use fetch directly for public endpoints (no auth token)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/public/forms/${publicId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch form');
    }

    return response.json();
}

// Submit a candidate application (no authentication required)
export async function submitApplication(
    publicId: string,
    data: Record<string, any>
): Promise<any> {
    // Use fetch directly for public endpoints (no auth token)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/public/forms/${publicId}/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
    }

    return response.json();
}

// Create a new form
export async function createForm(title: string, description: string): Promise<any> {
    return post('/forms', {
        title,
        description,
    });
}

// Publish a form and generate a public ID
export async function publishForm(formId: string): Promise<any> {
    return patch(`/forms/${formId}/publish`, {});
}

// Update form details
export async function updateForm(
    formId: string,
    data: { title?: string; description?: string }
): Promise<any> {
    return patch(`/forms/${formId}`, data);
}

// Delete a form
export async function deleteForm(formId: string): Promise<any> {
    return del(`/forms/${formId}`);
}

// Get all fields for a form
export async function getFormFields(formId: string): Promise<any> {
    return get(`/forms/${formId}/fields`);
}

// Add a field to a form
export async function addFormField(
    formId: string,
    field: {
        type: string;
        label: string;
        required: boolean;
        order: number;
    }
): Promise<any> {
    return post(`/forms/${formId}/fields`, field);
}
