'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import userService from '@/services/user.service';
import educatorService from '@/services/educator.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';

interface EducatorFields {
    bio: string;
    about: string;
    doubtOpen: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        email: '',
        phone: '',
        age: 0,
        gender: '',
        pfp: ''
    });
    const [educatorFields, setEducatorFields] = useState<EducatorFields>({
        bio: '',
        about: '',
        doubtOpen: false
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchProfiles();
        }
    }, [user]);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const userProfileResponse = await userService.getProfile();
            setProfile(userProfileResponse.data);

            if (user?.isEducator) {
                const educatorProfileResponse = await educatorService.getEducatorProfile();
                if (educatorProfileResponse.success) {
                    setEducatorFields(educatorProfileResponse.data);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async () => {
        try {
            const response = await educatorService.toggleDoubtAvailability();
            if (response.success) {
                setEducatorFields(prev => ({
                    ...prev,
                    doubtOpen: !prev.doubtOpen
                }));
                toast.success('Availability updated successfully');
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
            toast.error('Failed to update availability');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
                    <div className="p-6">
                        {/* Profile picture section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={profile.pfp || "https://avatar.iran.liara.run/public"}
                                    alt={profile.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-gray-700"
                                />
                            </div>
                            <h2 className="text-xl text-white font-semibold">{profile.name}</h2>
                            <p className="text-gray-400">{profile.email}</p>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                                My Profile
                            </h1>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                        isEditing 
                                            ? 'bg-red-500 hover:bg-red-600' 
                                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                    } text-white font-semibold`}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                                {user?.isEducator && (
                                    <button
                                        onClick={handleToggleAvailability}
                                        className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                            educatorFields.doubtOpen 
                                                ? 'bg-green-500 hover:bg-green-600' 
                                                : 'bg-red-500 hover:bg-red-600'
                                        } text-white font-semibold`}
                                    >
                                        {educatorFields.doubtOpen ? 'Available' : 'Unavailable'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile details */}
                        <div className="space-y-6">
                            {/* Add your profile fields here */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Name</label>
                                    <p className="text-white">{profile.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white">{profile.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Phone</label>
                                    <p className="text-white">{profile.phone || 'Not provided'}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Age</label>
                                    <p className="text-white">{profile.age || 'Not provided'}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Gender</label>
                                    <p className="text-white">{profile.gender || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Educator-specific fields */}
                            {user?.isEducator && (
                                <div className="mt-8 pt-8 border-t border-gray-700">
                                    <h2 className="text-2xl font-bold text-white mb-6">Educator Profile</h2>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Bio</label>
                                            <p className="text-white">{educatorFields.bio || 'No bio provided'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">About</label>
                                            <p className="text-white">{educatorFields.about || 'No about information provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


