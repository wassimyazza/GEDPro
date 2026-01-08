'use client';

// Candidates list page

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../utils/auth';
import { listCandidates } from '../../api/candidates';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';

// Candidate statuses with labels and colors
const STATUSES: Record<string, { label: string; color: string }> = {
    NOUVEAU: { label: 'New', color: 'bg-blue-100 text-blue-800' },
    PRESELECTIONNE: { label: 'Pre-selected', color: 'bg-yellow-100 text-yellow-800' },
    ENTRETIEN_PLANIFIE: { label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800' },
    EN_ENTRETIEN: { label: 'In Interview', color: 'bg-indigo-100 text-indigo-800' },
    ACCEPTE: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
    REFUSE: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export default function CandidatesPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        loadCandidates();
    }, [router]);

    const loadCandidates = async () => {
        try {
            const data = await listCandidates();
            setCandidates(data || []);
        } catch (error) {
            console.error('Error loading candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter candidates by status
    const filteredCandidates = filterStatus === 'ALL'
        ? candidates
        : candidates.filter((c) => c.status === filterStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidates</h1>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidates</h1>

                {/* Filter buttons */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterStatus('ALL')}
                        className={`px-4 py-2 rounded-md font-medium ${filterStatus === 'ALL'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All ({candidates.length})
                    </button>
                    {Object.entries(STATUSES).map(([key, { label }]) => {
                        const count = candidates.filter((c) => c.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(key)}
                                className={`px-4 py-2 rounded-md font-medium ${filterStatus === key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Candidates list */}
                {filteredCandidates.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                {filterStatus === 'ALL' ? 'No candidates yet' : `No ${STATUSES[filterStatus]?.label.toLowerCase()} candidates`}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Candidates will appear here when they submit applications through job offer forms.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCandidates.map((candidate: any) => (
                            <Card
                                key={candidate.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => router.push(`/candidates/${candidate.id}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {candidate.data?.['Full Name'] || candidate.data?.['email'] || 'Candidate'}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${STATUSES[candidate.status]?.color || 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {STATUSES[candidate.status]?.label || candidate.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {candidate.data?.['Email Address'] || candidate.data?.email || 'No email'}
                                </p>
                                {candidate.data?.['Phone Number'] && (
                                    <p className="text-sm text-gray-500 mb-2">
                                        📞 {candidate.data['Phone Number']}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Applied: {new Date(candidate.createdAt).toLocaleDateString()}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
