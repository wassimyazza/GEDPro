'use client';

// Login page
// Simple login form for authentication

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../api/auth';
import { saveToken, isAuthenticated } from '../../utils/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function LoginPage() {
    const router = useRouter();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call the login API
            const response = await login(email, password);

            // Save the token
            saveToken(response.access_token);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            // Show error message
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login to GEDPro</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="admin@example.com"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter your password"
                        required
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
