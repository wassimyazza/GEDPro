'use client';

// HR Dashboard page
// Shows key metrics and quick actions

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../utils/auth';
import { listNotifications } from '../../api/notifications';
import { listInterviews } from '../../api/interviews';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function DashboardPage() {
    const router = useRouter();

    // State for dashboard data
    const [notifications, setNotifications] = useState<any[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Load dashboard data
        loadDashboardData();
    }, [router]);

    // Load data from API
    const loadDashboardData = async () => {
        try {
            // Get recent notifications
            try {
                const notifs = await listNotifications(true); // Only unread
                setNotifications(notifs.slice(0, 5)); // Show only first 5
            } catch (error: any) {
                console.log('Could not load notifications:', error.message);
                // Don't fail the whole dashboard if notifications fail
            }

            // Get today's date for filtering interviews
            const today = new Date().toISOString().split('T')[0];
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextWeekStr = nextWeek.toISOString().split('T')[0];

            // Get upcoming interviews
            try {
                const interviews = await listInterviews(today, nextWeekStr);
                setUpcomingInterviews(interviews.slice(0, 5)); // Show only first 5
            } catch (error: any) {
                console.log('Could not load interviews:', error.message);
                // Don't fail the whole dashboard if interviews fail
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
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
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card title="Candidates">
                        <p className="text-gray-600 mb-4">View and manage candidates</p>
                        <Button onClick={() => router.push('/candidates')}>
                            Go to Candidates
                        </Button>
                    </Card>

                    <Card title="Documents">
                        <p className="text-gray-600 mb-4">Upload and manage documents</p>
                        <Button onClick={() => router.push('/documents')}>
                            Go to Documents
                        </Button>
                    </Card>

                    <Card title="Interviews">
                        <p className="text-gray-600 mb-4">Schedule and view interviews</p>
                        <Button onClick={() => router.push('/interviews')}>
                            Go to Interviews
                        </Button>
                    </Card>
                </div>

                {/* Information sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upcoming Interviews */}
                    <Card title="Upcoming Interviews">
                        {upcomingInterviews.length === 0 ? (
                            <p className="text-gray-500">No upcoming interviews</p>
                        ) : (
                            <ul className="space-y-2">
                                {upcomingInterviews.map((interview: any, index: number) => (
                                    <li key={index} className="border-b border-gray-200 pb-2">
                                        <div className="text-sm font-medium">{interview.candidateId}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(interview.scheduledAt).toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Recent Notifications */}
                    <Card title="Recent Notifications">
                        {notifications.length === 0 ? (
                            <p className="text-gray-500">No new notifications</p>
                        ) : (
                            <ul className="space-y-2">
                                {notifications.map((notif: any, index: number) => (
                                    <li key={index} className="border-b border-gray-200 pb-2">
                                        <div className="text-sm">{notif.message}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(notif.createdAt).toLocaleString()}
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
