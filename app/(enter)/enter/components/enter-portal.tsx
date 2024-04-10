"use client"

import { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export default function EnterPortal() {
  const [role, setRole] = useState('');

  const handleRoleSelection = (selectedRole: any) => {
    setRole(selectedRole);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-5 py-3">
            <h3 className="text-gray-700 dark:text-gray-200 text-lg">Sign In</h3>
          </div>
          <div className="px-5 py-2">
            <div className="space-y-5">
              <div className="flex justify-center space-x-2">
                <Button className="w-1/2" variant={role === 'User' ? "default" : "outline"} onClick={() => handleRoleSelection('User')}>User</Button>
                <Button className="w-1/2" variant={role === 'Agency' ? "default" : "outline"} onClick={() => handleRoleSelection('Agency')}>Agency</Button>
              </div>
              <SignIn afterSignInUrl={role === 'User' ? "/profile" : "/agency"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}