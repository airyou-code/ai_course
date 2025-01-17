import React, { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

interface UserProfile {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  licenseKey: string;
  isLicenseExpired: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Member Name',
    email: 'member@email.com',
    firstName: 'John',
    lastName: 'Doe',
    licenseKey: 'XXXX-XXXX-XXXX-XXXX',
    isLicenseExpired: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log('Saving changes:', profile);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6 w-full">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>
          <button className="w-full bg-white text-black font-semibold py-2 rounded-lg mb-2">
            Manage Subscription
          </button>
          <button className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg">
            Change Password
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6 w-full">
          <h3 className="text-xl font-bold mb-4">Renew or Upgrade</h3>
          <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-4">
            <div className="flex items-center">
              <AlertTriangle className="text-yellow-500 mr-2" />
              <span>Your license is expired</span>
            </div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
              Buy License
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="licenseKey" className="block mb-2">License Key</label>
            <input
              type="text"
              id="licenseKey"
              name="licenseKey"
              value={profile.licenseKey}
              onChange={handleInputChange}
              className="w-full bg-gray-800 rounded-lg p-2"
            />
          </div>
          <button className="w-full bg-white text-black font-semibold py-2 rounded-lg">
            Activate
          </button>
        </div>

        <form onSubmit={handleSaveChanges} className="bg-gray-900 rounded-lg p-6 mb-6 w-full">
          <h3 className="text-xl font-bold mb-4">Personal Info</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              className="w-full bg-gray-800 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              className="w-full bg-gray-800 rounded-lg p-2"
            />
          </div>
          <button type="submit" className="w-full bg-white text-black font-semibold py-2 rounded-lg">
            Save Changes
          </button>
        </form>

        <button className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg max-w-3xl mx-auto block">
          Sign Out
        </button>
      </div>
    </div>
  );
}

