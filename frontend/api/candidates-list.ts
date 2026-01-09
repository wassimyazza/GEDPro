// API functions for listing candidates
// Since backend doesn't have a list endpoint, we fetch from forms submissions

import { get } from './client';

// Get candidates by fetching all form data
// This is a workaround since the backend doesn't have GET /candidates
export async function listCandidates(): Promise<any[]> {
    try {
        // Get all forms first
        const forms = await get('/forms');

        // For each form, we would normally get candidates
        // But since there's no endpoint, we'll return empty for now
        // The actual candidates are submissions to forms

        // Note: The backend has candidates in the database but no API to list them
        // This is a limitation of the backend

        return [];
    } catch (error) {
        console.error('Error listing candidates:', error);
        return [];
    }
}

// Get a specific candidate by ID
export async function getCandidate(id: string): Promise<any> {
    // Note: Backend doesn't have GET /candidates/:id
    // Only has PATCH /candidates/:id/status and GET /candidates/:id/history
    throw new Error('Backend does not support getting candidate details');
}
