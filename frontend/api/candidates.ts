// API functions for candidates
import { get, patch } from './client';

// List all candidates for the organization
// Note: This uses the candidates endpoint if it exists
export async function listCandidates(): Promise<any[]> {
    try {
        // Try to fetch candidates directly
        const response = await get('/candidates');
        return response;
    } catch (error) {
        console.error('Error listing candidates:', error);
        return [];
    }
}

// Update candidate status
export async function updateCandidateStatus(
    candidateId: string,
    status: string
): Promise<any> {
    return patch(`/candidates/${candidateId}/status`, { status });
}

// Get candidate history
export async function getCandidateHistory(candidateId: string): Promise<any> {
    return get(`/candidates/${candidateId}/history`);
}
