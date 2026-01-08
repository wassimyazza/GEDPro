'use client';

// Candidate detail page
// Shows detailed information about a specific candidate

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '../../../utils/auth';
import { updateCandidateStatus, getCandidateHistory } from '../../../api/candidates';
import Navbar from '../../../components/Navbar';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

// Candidate statuses
const STATUSES = ['NOUVEAU', 'PRESELECTIONNE', 'ACCEPTE', 'REJETE'];

export default function CandidateDetailPage() {
    const router = useRouter();
    const params = useParams();
    const candidateId = params.id as string;

    const [candidate, setCandidate] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        loadCandidateData();
    }, [router, candidateId]);

    // Load candidate data
    const loadCandidateData = async () => {
        try {
            // Get candidate history
            const historyData = await getCandidateHistory(candidateId);
            setHistory(historyData);

            // For now, create a placeholder candidate object
            // In a real app, you'd fetch the full candidate details
            setCandidate({
                id: candidateId,
                name: 'Candidate Name',
                email: 'candidate@example.com',
                status: historyData.length > 0 ? historyData[0].status : 'NOUVEAU',
            });

            setSelectedStatus(historyData.length > 0 ? historyData[0].status : 'NOUVEAU');
        } catch (error) {
            console.error('Error loading candidate:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update candidate status
    const handleUpdateStatus = async () => {
        if (!selectedStatus || selectedStatus === candidate.status) {
            return;
        }

        setUpdating(true);
        try {
            await updateCandidateStatus(candidateId, selectedStatus);

            // Reload data
            await loadCandidateData();

            alert('Status updated successfully!');
        } catch (error: any) {
            alert('Error updating status: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.push('/candidates')}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                >
                    ← Back to Candidates
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Candidate Details
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Candidate info */}
                    <Card title="Information">
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Name:</span>
                                <p className="text-gray-800">{candidate?.name}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                <p className="text-gray-800">{candidate?.email}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                                <p className="text-gray-800">{candidate?.status}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Update status */}
                    <Card title="Update Status">
                        <div className="space-y-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <Button
                                onClick={handleUpdateStatus}
                                disabled={updating || selectedStatus === candidate?.status}
                                variant="primary"
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </Button>
                        </div>
                    </Card>

                    {/* Status history */}
                    <Card title="Status History" className="md:col-span-2">
                        {history.length === 0 ? (
                            <p className="text-gray-500">No status history</p>
                        ) : (
                            <ul className="space-y-2">
                                {history.map((item: any, index: number) => (
                                    <li key={index} className="border-b border-gray-200 pb-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{item.status}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </span>
                                        </div>
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
