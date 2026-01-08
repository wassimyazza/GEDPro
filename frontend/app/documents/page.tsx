'use client';

// Documents page
// Upload and manage documents for candidates

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../utils/auth';
import { uploadDocument } from '../../api/documents';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function DocumentsPage() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [candidateId, setCandidateId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
    }, [router]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Handle upload
    const handleUpload = async () => {
        if (!file || !candidateId) {
            alert('Please select a file and enter a candidate ID');
            return;
        }

        setUploading(true);
        try {
            const result = await uploadDocument(file, candidateId);
            alert('Document uploaded successfully!');

            // Reset form
            setFile(null);
            setCandidateId('');

            // Reload documents list (placeholder)
            // In a real app, you would fetch the documents list
        } catch (error: any) {
            alert('Error uploading document: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Documents</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload form */}
                    <Card title="Upload Document">
                        <div className="space-y-4">
                            <Input
                                label="Candidate ID"
                                type="text"
                                value={candidateId}
                                onChange={setCandidateId}
                                placeholder="Enter candidate ID"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select File <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                {file && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Selected: {file.name}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={handleUpload}
                                disabled={uploading || !file || !candidateId}
                                variant="primary"
                            >
                                {uploading ? 'Uploading...' : 'Upload Document'}
                            </Button>
                        </div>
                    </Card>

                    {/* Documents list */}
                    <Card title="Recent Documents">
                        {documents.length === 0 ? (
                            <p className="text-gray-500">
                                No documents yet. Upload a document to get started.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {documents.map((doc: any, index: number) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center border-b border-gray-200 pb-2"
                                    >
                                        <div>
                                            <p className="font-medium">{doc.filename}</p>
                                            <p className="text-xs text-gray-500">
                                                Candidate: {doc.candidateId}
                                            </p>
                                        </div>
                                        <Button variant="secondary" onClick={() => { }}>
                                            Download
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
