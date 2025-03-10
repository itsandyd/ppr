'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaDiscord } from 'react-icons/fa';
import Button from '../Button';
import { useUser, useAuth } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';

interface DiscordUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DiscordUsernameModal: React.FC<DiscordUsernameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isLoaded } = useUser();
  const [discordAccount, setDiscordAccount] = useState<any>(null);
  const [needsConnect, setNeedsConnect] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has connected Discord already
  useEffect(() => {
    console.log('DiscordUsernameModal - Auth state:', { 
      user: !!user, 
      isLoaded,
      discordConnections: user?.externalAccounts?.length || 0
    });
    
    if (isLoaded && user) {
      const discord = user.externalAccounts.find(
        account => account.provider === 'discord'
      );
      
      setDiscordAccount(discord);
    }
  }, [isLoaded, user]);

  const handleVerifyDiscord = async () => {
    if (!discordAccount) return;
    
    setIsVerifying(true);
    try {
      // Send verification request to our API
      const response = await axios.post('/api/discord/verify-username', {
        discordUsername: discordAccount.username
      });
      
      toast.success('Discord account verified successfully!');
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to verify Discord account.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConnectDiscord = async () => {
    // This will redirect to Discord OAuth flow via Clerk
    try {
      setIsLoading(true);
      
      // Redirect to Clerk's user profile to connect Discord
      if (user) {
        await user.createExternalAccount({
          strategy: "oauth_discord",
          redirect_url: window.location.href, // Return to the current page after connection
        });
      } else {
        toast.error('No user logged in. Please log in first.');
      }
    } catch (error) {
      console.error('Discord connection error:', error);
      toast.error('Failed to connect Discord account.');
      setIsLoading(false);
    }
  };

  if (!isOpen || !isLoaded) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Connect Discord Account"
      onClose={onClose}
      onSubmit={() => {}}
      actionLabel=""
      body={
        <div className="p-1">
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              Discord Required for Coaching
            </h2>
            
            <p className="text-sm sm:text-base mb-3 dark:text-neutral-300">
              Coaching sessions take place in our Discord community. You'll need to:
            </p>
            
            <ol className="list-decimal pl-5 mb-3 text-sm sm:text-base dark:text-neutral-300 space-y-2">
              <li>Connect your Discord account</li>
              <li>Verify you're a member of our Discord server</li>
            </ol>
            
            <p className="text-sm sm:text-base dark:text-neutral-300">
              <strong>Note:</strong> This only connects your Discord account for coaching. You'll still use your main login method ({user?.primaryEmailAddress?.emailAddress}) to access the website.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : discordAccount ? (
            <>
              <div className="mb-5">
                <p className="mb-4 text-sm sm:text-base dark:text-neutral-300">
                  Your Discord account is connected as <strong>{discordAccount.username}</strong>. Click the button below to verify you're a member of our Discord server and set up access for your coaching sessions.
                </p>
              </div>
              
              <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md mb-5">
                <p className="font-medium mb-1">Why do we need this?</p>
                <p>
                  Your Discord account allows us to verify you're a member of our server and set up private coaching channels for your sessions.
                  We'll also assign you the proper roles for access to coaching resources.
                </p>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 
                    dark:hover:bg-neutral-700 rounded-md transition"
                >
                  Cancel
                </button>
                <Button
                  label={
                    isVerifying ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Verifying...
                      </span>
                    ) : 'Verify Discord Account'
                  }
                  onClick={handleVerifyDiscord}
                  disabled={isVerifying}
                />
              </div>
            </>
          ) : (
            <div className="mb-5">
              <p className="mb-4 text-sm sm:text-base dark:text-neutral-300">
                To access your coaching sessions, we need to connect to your Discord account.
              </p>
              
              <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md mb-5">
                <p className="font-medium mb-1">This won't change your login method</p>
                <p>
                  You'll still use your current account ({user?.primaryEmailAddress?.emailAddress}) to login. 
                  Discord will only be used for coaching sessions communication.
                </p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleConnectDiscord}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                    text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaDiscord className="mr-2 text-xl" />
                      Connect with Discord
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default DiscordUsernameModal; 