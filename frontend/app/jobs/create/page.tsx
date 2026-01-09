'use client';

// Create new job offer page

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole } from '../../../utils/auth';
import { createForm } from '../../../api/forms';
import Navbar from '../../../components/Navbar';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

export default function CreateJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Only RH and Admin RH can create job offers
        const role = getUserRole();
        if (role !== 'adminRH' && role !== 'rh') {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createForm(title, description);
            router.push('/jobs');
        } catch (err: any) {
            setError(err.message || 'Failed to create job offer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Job Offer</h1>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Job Title"
                            type="text"
                            value={title}
                            onChange={setTitle}
                            placeholder="e.g., Senior Full Stack Developer"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter job description..."
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Job Offer'}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push('/jobs')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
