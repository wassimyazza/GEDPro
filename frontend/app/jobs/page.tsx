'use client';

// Job Offers listing page
// Client Component that fetches authenticated forms data

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listForms } from '../../api/forms';
import { isAuthenticated, getUserRole } from '../../utils/auth';
import Navbar from '../../components/Navbar';

export default function JobsPage() {
    const router = useRouter();
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        loadForms();
    }, [router]);

    const loadForms = async () => {
        try {
            // Fetch forms using authenticated endpoint
            const data = await listForms();
            setForms(data);
        } catch (err: any) {
            console.error('Error loading forms:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter only published forms
    const publishedForms = forms.filter((form: any) => form.publicId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Offers</h1>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Offers</h1>

                {error ? (
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Unable to Load Job Offers</h2>
                        <p className="text-gray-600">
                            There was an error loading job offers. Please try again later.
                        </p>
                    </div>
                ) : publishedForms.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">No Published Job Offers</h2>
                        <p className="text-gray-500">
                            Job offers will appear here once they are published. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedForms.map((form: any) => (
                            <Link
                                key={form.id}
                                href={`/jobs/${form.publicId}`}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {form.title}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {form.description || 'No description available'}
                                </p>
                                <span className="text-blue-600 font-medium hover:underline">
                                    View Details →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

