'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login page even if logout fails
        router.push('/login');
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4 p-8 bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600">
            <LogOut className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">Logging Out...</h1>
        <p className="text-gray-400">Thank you for using Learn Sphere. See you soon!</p>
      </div>
    </div>
  );
}