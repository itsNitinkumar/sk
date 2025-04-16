'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import authService from '@/services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const accessToken = authService.getAccessToken();
                const refreshToken = authService.getRefreshToken();

                if (!accessToken && !refreshToken) {
                    throw new Error('No tokens found');
                }

                if (!accessToken && refreshToken) {
                    try {
                        await authService.refreshToken();
                    } catch (error) {
                        throw new Error('Token refresh failed');
                    }
                }

                // Validate session with backend
                try {
                    const response = await authService.validateSession();
                    
                    // Check role requirements if specified
                    if (requiredRole && response.user.role !== requiredRole) {
                        throw new Error('Insufficient permissions');
                    }
                } catch (error) {
                    throw new Error('Session validation failed');
                }

                setIsValidating(false);
            } catch (error) {
                console.error('Authentication failed:', error);
                await logout();
                router.push('/login');
            }
        };

        validateSession();
    }, [router, logout, requiredRole]);

    if (loading || isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

