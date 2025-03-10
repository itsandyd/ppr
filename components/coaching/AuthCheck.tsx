'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ 
  children
}) => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading authentication...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthCheck; 