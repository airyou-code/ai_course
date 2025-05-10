import React, { useState } from 'react';
import LayoutShadcn from '@/components/layout/LayoutShadcn';
import UserProfile from '@/components/user/user-profile';

interface UserProfileProps{
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  licenseKey: string;
  isLicenseExpired: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileProps>({
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
    <LayoutShadcn>
      <UserProfile />
    </LayoutShadcn>
  );
}

