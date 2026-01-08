// Interviews API functions
// Functions to call the backend interviews endpoints

import { get, post, patch } from './client';

// List interviews with optional date filters
export async function listInterviews(
    dateFrom?: string,
    dateTo?: string
): Promise<any> {
    let endpoint = '/interviews';

    // Add query parameters if provided
    const params = new URLSearchParams();
    if (dateFrom) {
        params.append('date_from', dateFrom);
    }
    if (dateTo) {
        params.append('date_to', dateTo);
    }

    if (params.toString()) {
        endpoint += `?${params.toString()}`;
    }

    return get(endpoint);
}

// Create a new interview
export async function createInterview(
    candidateId: string,
    scheduledAt: string,
    participants: string[]
): Promise<any> {
    return post('/interviews', {
        candidateId,
        scheduledAt,
        participants,
    });
}

// Update an interview
export async function updateInterview(
    interviewId: string,
    data: {
        scheduledAt?: string;
        participants?: string[];
    }
): Promise<any> {
    return patch(`/interviews/${interviewId}`, data);
}

// Cancel an interview
export async function cancelInterview(interviewId: string): Promise<any> {
    return patch(`/interviews/${interviewId}/cancel`, {});
}
