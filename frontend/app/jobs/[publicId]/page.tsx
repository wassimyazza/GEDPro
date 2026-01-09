'use client';

// Job offer detail and application form
// Uses client component for form submission

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPublicForm, submitApplication } from '../../../api/forms';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const publicId = params.publicId as string;

    const [form, setForm] = useState<any>(null);
    const [fields, setFields] = useState<any[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Load form data on mount
    useEffect(() => {
        loadFormData();
    }, [publicId]);

    const loadFormData = async () => {
        try {
            const data = await getPublicForm(publicId);
            setForm(data);
            setFields(data.fields || []);

            // Initialize form data with empty values
            const initialData: Record<string, any> = {};
            (data.fields || []).forEach((field: any) => {
                initialData[field.id] = '';
            });
            setFormData(initialData);
        } catch (error: any) {
            console.error('Error loading form:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const missingFields = fields.filter(
            (field) => field.required && !formData[field.id]
        );

        if (missingFields.length > 0) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await submitApplication(publicId, formData);
            setSubmitted(true);
        } catch (error: any) {
            alert('Error submitting application: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle input change
    const handleInputChange = (fieldId: string, value: any) => {
        setFormData({
            ...formData,
            [fieldId]: value,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">Loading job offer...</p>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Card>
                    <p className="text-gray-600">Job offer not found</p>
                    <button
                        onClick={() => router.push('/jobs')}
                        className="text-blue-600 hover:underline mt-4"
                    >
                        ← Back to job offers
                    </button>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Card className="text-center max-w-md">
                    <div className="text-green-600 text-5xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Application Submitted!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for applying. We will review your application and get back to you soon.
                    </p>
                    <Button onClick={() => router.push('/jobs')} variant="primary">
                        View Other Opportunities
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.push('/jobs')}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                >
                    ← Back to job offers
                </button>

                <Card>
                    {/* Job offer details */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {form.title}
                        </h1>
                        <p className="text-gray-600">
                            {form.description || 'No description available'}
                        </p>
                    </div>

                    {/* Application form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Submit Your Application
                        </h2>

                        {fields.length === 0 ? (
                            <p className="text-gray-500">No form fields configured</p>
                        ) : (
                            fields.map((field: any) => (
                                <div key={field.id} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            required={field.required}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            required={field.required}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    )}
                                </div>
                            ))
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting}
                            className="w-full"
                        >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
