'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import educatorService from '@/services/educator.service';
import toast from 'react-hot-toast';

export default function EducatorRegistration() {
  const [formData, setFormData] = useState({
    bio: '',
    about: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await educatorService.registerAsEducator(formData.bio, formData.about, false);
      toast.success('Successfully registered as an educator!');
      router.push('/educator/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register as educator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Complete Educator Profile</h2>
          <p className="mt-2 text-gray-400">Tell us more about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="text-white">Short Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="A brief introduction about yourself"
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="about" className="text-white">Detailed About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Your detailed background, expertise, and teaching experience"
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                rows={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}