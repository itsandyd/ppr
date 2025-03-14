'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaDiscord } from 'react-icons/fa';
import Button from '../Button';
import { useUser, useAuth, UserButton, UserProfile } from '@clerk/nextjs';
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
  const [showUserProfilePage, setShowUserProfilePage] = useState(false);
  
  // Check if user has connected Discord already
  useEffect(() => {
    console.log('DiscordUsernameModal - Auth state:', { 
      user: !!user, 
      isLoaded,
      discordConnections: user?.externalAccounts?.length || 0
    });
    
    if (isLoaded && user) {
      // Look for discord connections - could be 'oauth_discord' or 'discord'
      const discord = user.externalAccounts.find(
        account => account.provider.toLowerCase().includes('discord')
      );
      
      if (discord) {
        console.log('Found Discord account:', discord.username || 'Username not available');
      }
      
      setDiscordAccount(discord);
    }
  }, [isLoaded, user]);

  // Check if we just returned from Discord OAuth flow
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const discordConnected = url.searchParams.get('discord');
      
      if (discordConnected === 'connected') {
        // Remove the query parameter to avoid processing it multiple times
        url.searchParams.delete('discord');
        window.history.replaceState({}, document.title, url.toString());
        
        // Show success toast
        toast.success('Discord connected successfully! Click "Verify Discord Account" to complete the process.');
        
        // Refresh user data to get latest external accounts
        if (user) {
          user.reload();
        }
      }
    }
  }, [user]);

  const handleVerifyDiscord = async () => {
    if (!discordAccount) return;
    
    // Ensure we have a valid username
    if (!discordAccount.username) {
      toast.error('Discord username is required. Please reconnect your Discord account.');
      setShowUserProfilePage(true);
      return;
    }
    
    setIsVerifying(true);
    try {
      // Send verification request to our API
      const response = await axios.post('/api/discord/verify-username', {
        discordId: discordAccount.externalId,
      });
      
      toast.success('Discord account verified successfully!');
      
      // Reload the user to get the updated metadata
      if (user) {
        await user.reload();
        console.log('Reloaded user data with discord verification status:', user.publicMetadata);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Verification error details:', error.response?.data);
      
      // Check if we need to reconnect Discord
      if (error.response?.data?.invalidUsername) {
        toast.error('Could not retrieve your Discord username. Please reconnect your Discord account with all permissions.');
        handleReconnectDiscord();
      } else if (error.response?.data?.needsAuth) {
        toast.error('Your Discord connection needs to be refreshed. Please reconnect with all permissions.');
        handleReconnectDiscord();
      } else if (error.response?.status === 500) {
        toast.error(error.response?.data?.error || 'Server error verifying Discord account. Please try again.');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to verify Discord account. Please try reconnecting with all permissions.');
        handleReconnectDiscord();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // When user completes connecting Discord via UserButton
  const handleUserProfileAppearance = () => {
    if (user) {
      // Add a short delay to ensure Discord data has propagated
      setTimeout(async () => {
        try {
          // Force a full reload of user data from Clerk
          await user.reload();
          
          // Look for Discord connection
          const discord = user.externalAccounts.find(
            account => account.provider.toLowerCase().includes('discord')
          );
          
          // Log detailed Discord connection info
          console.log('Discord connection details:', {
            connected: !!discord,
            account: discord,
            username: discord?.username,
            externalId: discord?.id, 
            allAccounts: user.externalAccounts
          });
          
          if (discord) {
            setDiscordAccount(discord);
            
            if (discord.username) {
              toast.success(`Discord connected as ${discord.username}! Click "Verify Discord Account" to complete the process.`);
            } else {
              // Even without a username, we proceed with verification
              toast.success('Discord connected! Click "Verify Discord Account" to complete the process.');
            }
          }
          
          setShowUserProfilePage(false);
        } catch (error) {
          console.error('Error refreshing user data:', error);
          toast.error('Failed to refresh user data. Please try again.');
          setShowUserProfilePage(false);
        }
      }, 1000); // 1 second delay to ensure data is refreshed
    }
  };

  // Connect with Discord via direct OAuth (alternative to UserButton)
  const handleConnectDiscord = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast.error('No user logged in. Please log in first.');
        setIsLoading(false);
        return;
      }
      
      toast.success('Connecting to Discord...', {
        duration: 5000,
        id: 'discord-connect',
      });
      
      // Check if user has an existing Discord connection
      const existingDiscord = user.externalAccounts.find(
        account => account.provider.toLowerCase().includes('discord')
      );
      
      if (existingDiscord) {
        console.log('User already has a Discord connection, forcing a reconnection to get proper scopes');
      }
      
      try {
        // Use Clerk's built-in OAuth flow with explicit scopes to ensure we get identity
        await user.createExternalAccount({
          strategy: "oauth_discord",
          redirect_url: window.location.href,
          // Note: Scopes are configured at the application level in the Clerk Dashboard
          // Default scopes for Discord include 'identify' which gives us the username
        });
        
        // This will redirect to Discord's OAuth page, so the following code will not execute
        // until the user returns from the OAuth flow
      } catch (error: any) {
        console.error('Failed to initiate Discord OAuth:', error);
        
        if (error.message?.includes('network')) {
          toast.error('Network error connecting to Discord. Please check your internet connection.');
        } else if (error.message?.includes('canceled')) {
          toast.error('Discord connection was canceled. Please try again.');
        } else {
          toast.error('Failed to connect Discord account. Please try again.');
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Discord connection error:', error);
      toast.error('Failed to connect Discord account.');
      setIsLoading(false);
    }
  };

  // Direct reconnect function to force a new Discord connection
  const handleReconnectDiscord = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Tell user what's happening
      toast.success('Initiating Discord reconnection...', {
        id: 'reconnect-discord',
        duration: 3000
      });
      
      console.log('Starting direct Discord reconnection flow');
      
      // Use the direct OAuth approach which is more reliable than showing the UserButton
      await user.createExternalAccount({
        strategy: "oauth_discord",
        redirect_url: window.location.href,
      });
      
      // The above will redirect to Discord's OAuth page, so the code below won't execute
      // until the user returns from the OAuth flow
    } catch (error) {
      console.error('Error initiating Discord reconnection:', error);
      toast.error('Failed to initiate Discord reconnection. Please try again or use the direct connect button below.');
      setIsLoading(false);
      
      // As a fallback, show the user profile page
      setShowUserProfilePage(true);
    }
  }, [user]);

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
              Coaching sessions take place in our Discord community. You&apos;ll need to:
            </p>
            
            <ol className="list-decimal pl-5 mb-3 text-sm sm:text-base dark:text-neutral-300 space-y-2">
              <li>Connect your Discord account</li>
              <li>Verify you&apos;re a member of our Discord server</li>
            </ol>
            
            <p className="text-sm sm:text-base dark:text-neutral-300">
              <strong>Note:</strong> This only connects your Discord account for coaching. You&apos;ll still use your main login method ({user?.primaryEmailAddress?.emailAddress}) to access the website.
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
                  Your Discord account is connected
                  {discordAccount.username ? (
                    <> as <strong>{discordAccount.username}</strong></>
                  ) : null}
                  . Click the button below to verify you&apos;re a member of our Discord server and set up access for your coaching sessions.
                </p>
              </div>
              
              {!discordAccount.username && (
                <div className="p-4 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-md mb-5">
                  <h3 className="text-sm font-semibold mb-1">Discord Username Missing</h3>
                  <p className="text-xs mb-2">
                    We couldn&apos;t retrieve your Discord username through the authorization process.
                    This happens when the &quot;Identity&quot; permission wasn&apos;t granted or the Discord API didn&apos;t return your username.
                  </p>
                  <p className="text-xs mb-4">
                    Please use one of the options below to reconnect with Discord and make sure to approve <strong>all requested permissions</strong>.
                    If you previously declined permissions, you may need to log out of Discord in your browser first.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      label="Reconnect Discord"
                      onClick={handleReconnectDiscord}
                      outline
                    />
                    <button
                      onClick={handleConnectDiscord}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                        text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <FaDiscord className="mr-2" />
                          Direct Discord Connect
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md mb-5">
                <p className="font-medium mb-1">Why do we need this?</p>
                <p>
                  Your Discord account allows us to verify you&apos;re a member of our server and set up private coaching channels for your sessions.
                  We&apos;ll also assign you the proper roles for access to coaching resources.
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
                
                {!discordAccount.username ? (
                  <Button
                    label="Reconnect Discord"
                    onClick={handleReconnectDiscord}
                    // Make it more prominent by using primary style
                  />
                ) : (
                  <>
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
                    <Button
                      label="Reconnect Discord"
                      onClick={handleReconnectDiscord}
                      outline
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="mb-5">
              <p className="mb-4 text-sm sm:text-base dark:text-neutral-300">
                To access your coaching sessions, we need to connect to your Discord account.
              </p>
              
              <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded-md mb-5">
                <h3 className="text-sm font-semibold mb-1">Important: Authorize All Permissions</h3>
                <p className="text-xs mb-2">
                  When connecting Discord, please <strong>accept all requested permissions</strong>, 
                  especially <strong>&quot;Identity&quot;</strong>, which is required to retrieve your Discord username.
                </p>
                <p className="text-xs mb-2">
                  If your Discord username is not detected after connecting, use the <strong>Reconnect Discord</strong> button
                  and ensure you accept all permission requests on Discord&apos;s authorization page.
                </p>
                <p className="text-xs">
                  If you previously declined permissions, you may need to completely sign out of Discord in your browser 
                  before trying again.
                </p>
              </div>
              
              <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md mb-5">
                <p className="font-medium mb-1">This won&apos;t change your login method</p>
                <p>
                  You&apos;ll still use your current account ({user?.primaryEmailAddress?.emailAddress}) to login. 
                  Discord will only be used for coaching sessions communication.
                </p>
              </div>
              
              {showUserProfilePage ? (
                <div className="mt-6">
                  <div className="p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded-md mb-5">
                    <h3 className="text-base font-semibold mb-2">Connect Your Discord Account</h3>
                    <ol className="list-decimal pl-5 text-sm mb-3 space-y-2">
                      <li>Click on your profile avatar below</li>
                      <li>Click on <strong>&quot;Manage account&quot;</strong> in the menu</li>
                      <li>Select <strong>&quot;Add account&quot;</strong> or <strong>&quot;Connect account&quot;</strong></li>
                      <li>Choose <strong>Discord</strong> from the list</li>
                      <li>Make sure to <strong>accept all permissions</strong> on Discord&apos;s authorization page</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-4 p-3 border-2 border-indigo-500 rounded-lg animate-pulse">
                      {/* 
                        Using additionalOAuthScopes to request 'identify' scope for Discord.
                        This tells Clerk to request this scope when reconnecting, which is crucial
                        for getting the Discord username through the OAuth process.
                      */}
                      <UserButton 
                        appearance={{
                          elements: {
                            userButtonPopoverCard: "min-w-[360px]",
                            userButtonBox: "w-12 h-12", // Make the button bigger
                            userButtonAvatarBox: "w-12 h-12" // Make the avatar bigger
                          }
                        }}
                        afterSignOutUrl="/"
                        userProfileMode="modal"
                        userProfileUrl="/user-profile"
                        userProfileProps={{
                          additionalOAuthScopes: {
                            discord: ['identify']
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm text-center mb-3">👆 Click your avatar, then &quot;Manage account&quot; to add Discord 👆</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setShowUserProfilePage(false);
                        // After closing the profile, check for new Discord connections
                        handleUserProfileAppearance();
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {/* Add direct connect button as alternative */}
                  <div className="mt-6 text-center border-t pt-4 dark:border-gray-700">
                    <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                      If you have trouble connecting through the profile, try our direct connect:
                    </p>
                    <button
                      onClick={handleConnectDiscord}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
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
                          Direct Discord Connect
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowUserProfilePage(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                      text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <FaDiscord className="mr-2 text-xl" />
                    Connect with Discord
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      }
    />
  );
};

export default DiscordUsernameModal; 