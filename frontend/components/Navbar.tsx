'use client';

// Navigation bar component
// Shows navigation links and user info

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserRole, getUserEmail, removeToken } from '../utils/auth';

export default function Navbar() {
    const router = useRouter();

    // Get user info from token - use state to avoid hydration mismatch
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Load user data only on client side
    useEffect(() => {
        setUserRole(getUserRole());
        setUserEmail(getUserEmail());
        setMounted(true);
    }, []);

    // Handle logout
    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    // Don't render user info until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                                GEDPro
                            </Link>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/candidates" className="text-gray-700 hover:text-blue-600 font-medium">
                                Candidates
                            </Link>
                            <Link href="/documents" className="text-gray-700 hover:text-blue-600 font-medium">
                                Documents
                            </Link>
                            <Link href="/interviews" className="text-gray-700 hover:text-blue-600 font-medium">
                                Interviews
                            </Link>
                            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">
                                Job Offers
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <div className="text-gray-700">Loading...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and title */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                            GEDPro
                        </Link>
                    </div>

                    {/* Navigation links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/candidates"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Candidates
                        </Link>
                        <Link
                            href="/documents"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Documents
                        </Link>
                        <Link
                            href="/interviews"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Interviews
                        </Link>
                        <Link
                            href="/jobs"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Job Offers
                        </Link>
                    </div>

                    {/* User info and logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <div className="text-gray-700">{userEmail}</div>
                            <div className="text-gray-500 text-xs">{userRole}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
