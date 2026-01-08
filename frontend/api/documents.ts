// Documents API functions
// Functions to call the backend documents endpoints

import { uploadFile, apiClient } from './client';

// Upload a document for a candidate
export async function uploadDocument(file: File, candidateId: string): Promise<any> {
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidateId', candidateId);

    return uploadFile('/documents/upload', formData);
}

// Download a document by ID
// Returns the response object (not JSON) so we can handle the blob
export async function downloadDocument(documentId: string): Promise<Response> {
    return apiClient(`/documents/${documentId}/download`, {
        method: 'GET',
    });
}
