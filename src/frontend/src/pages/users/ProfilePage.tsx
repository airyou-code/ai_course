import React, { useState } from 'react';
import LayoutShadcn from '@/components/layout/LayoutShadcn';
import UserProfile from '@/components/user/user-profile';


export default function ProfilePage() {

  return (
    <LayoutShadcn>
      <UserProfile />
    </LayoutShadcn>
  );
}

