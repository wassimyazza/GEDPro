'use client';

// Interviews page
// List and schedule interviews

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../utils/auth';
import { listInterviews, createInterview } from '../../api/interviews';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Table from '../../components/Table';

export default function InterviewsPage() {
    const router = useRouter();

    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scheduling, setScheduling] = useState(false);

    // Form state
    const [candidateId, setCandidateId] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [participants, setParticipants] = useState('');

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        loadInterviews();
    }, [router]);

    // Load interviews from API
    const loadInterviews = async () => {
        try {
            // Get interviews for the next 30 days
            const today = new Date().toISOString().split('T')[0];
            const nextMonth = new Date();
            nextMonth.setDate(nextMonth.getDate() + 30);
            const nextMonthStr = nextMonth.toISOString().split('T')[0];

            const data = await listInterviews(today, nextMonthStr);
            setInterviews(data);
        } catch (error) {
            console.error('Error loading interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    // Schedule a new interview
    const handleSchedule = async () => {
        if (!candidateId || !scheduledDate || !scheduledTime || !participants) {
            alert('Please fill in all fields');
            return;
        }

        // Combine date and time into ISO string
        const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00Z`).toISOString();

        // Parse participants (comma-separated emails)
        const participantsList = participants.split(',').map(p => p.trim());

        setScheduling(true);
        try {
            await createInterview(candidateId, scheduledAt, participantsList);
            alert('Interview scheduled successfully!');

            // Reset form
            setCandidateId('');
            setScheduledDate('');
            setScheduledTime('');
            setParticipants('');

            // Reload interviews
            await loadInterviews();
        } catch (error: any) {
            alert('Error scheduling interview: ' + error.message);
        } finally {
            setScheduling(false);
        }
    };

    // Format interviews for table display
    const tableData = interviews.map((interview: any) => ({
        candidateId: interview.candidateId,
        scheduledAt: new Date(interview.scheduledAt).toLocaleString(),
        participants: interview.participants.join(', '),
        status: interview.status || 'Scheduled',
    }));

    const tableColumns = [
        { key: 'candidateId', label: 'Candidate ID' },
        { key: 'scheduledAt', label: 'Date & Time' },
        { key: 'participants', label: 'Participants' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Interviews</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Schedule form */}
                    <Card title="Schedule Interview" className="lg:col-span-1">
                        <div className="space-y-4">
                            <Input
                                label="Candidate ID"
                                type="text"
                                value={candidateId}
                                onChange={setCandidateId}
                                placeholder="Enter candidate ID"
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={scheduledDate}
                                onChange={setScheduledDate}
                                required
                            />

                            <Input
                                label="Time"
                                type="time"
                                value={scheduledTime}
                                onChange={setScheduledTime}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Participants (emails, comma-separated) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={participants}
                                    onChange={(e) => setParticipants(e.target.value)}
                                    placeholder="rh@example.com, manager@example.com"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <Button
                                onClick={handleSchedule}
                                disabled={scheduling}
                                variant="primary"
                            >
                                {scheduling ? 'Scheduling...' : 'Schedule Interview'}
                            </Button>
                        </div>
                    </Card>

                    {/* Interviews list */}
                    <Card title="Upcoming Interviews" className="lg:col-span-2">
                        {loading ? (
                            <p className="text-gray-600">Loading interviews...</p>
                        ) : (
                            <Table columns={tableColumns} data={tableData} />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
