"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Check, X, CreditCard, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CoachSettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    accountId: string | null;
    isComplete: boolean;
    details?: any;
  }>({
    accountId: null,
    isComplete: false,
  });

  // Check if user came back from Stripe onboarding
  useEffect(() => {
    const stripe = searchParams?.get("stripe");
    if (stripe === "success") {
      toast.success("Stripe onboarding initiated successfully!");
      // Refresh the page to remove query params
      router.push("/coaching/settings");
    }
  }, [searchParams, router]);

  // Fetch coach profile and Stripe status
  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/coaching/profile");
        
        if (response.data?.coach) {
          const { stripeAccountId, stripeConnectComplete } = response.data.coach;
          
          setStripeStatus({
            accountId: stripeAccountId,
            isComplete: stripeConnectComplete,
          });

          // If they have a Stripe account, fetch its status
          if (stripeAccountId) {
            const stripeResponse = await axios.get(`/api/stripe/refresh-status`);
            if (stripeResponse.data) {
              setStripeStatus(prev => ({
                ...prev,
                details: stripeResponse.data,
                isComplete: stripeResponse.data.details_submitted && 
                           stripeResponse.data.charges_enabled && 
                           stripeResponse.data.payouts_enabled
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching coach profile:", error);
        toast.error("Failed to load coach settings");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachProfile();
  }, []);

  const handleStripeConnect = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stripe/connect-account');
      
      if (response.data.url) {
        // Open Stripe Connect onboarding in a new window
        window.open(response.data.url, '_blank');
        toast.success("Redirecting to Stripe Connect...");
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      toast.error("Failed to connect with Stripe");
    } finally {
      setLoading(false);
    }
  };

  const refreshStripeStatus = async () => {
    try {
      setLoading(true);
      
      if (!stripeStatus.accountId) {
        toast.error("No Stripe account connected");
        return;
      }
      
      const response = await axios.get(`/api/stripe/refresh-status?accountId=${stripeStatus.accountId}`);
      
      if (response.data) {
        setStripeStatus(prev => ({
          ...prev,
          details: response.data,
          isComplete: response.data.details_submitted && 
                     response.data.charges_enabled && 
                     response.data.payouts_enabled
        }));
        
        toast.success("Stripe status refreshed");

        // Update the coach profile if status changed to complete
        if (response.data.details_submitted && 
            response.data.charges_enabled && 
            response.data.payouts_enabled && 
            !stripeStatus.isComplete) {
          await axios.post("/api/coaching/update-stripe-status", {
            stripeConnectComplete: true
          });
          toast.success("Your Stripe Connect setup is now complete!");
        }
      }
    } catch (error) {
      console.error("Error refreshing Stripe status:", error);
      toast.error("Failed to refresh Stripe status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Coach Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-neutral-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Stripe Connect Status
          </h2>
          
          <div className="space-y-4">
            {stripeStatus.accountId ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="font-medium">Account ID:</div>
                  <div className="text-sm font-mono bg-neutral-700 py-1 px-2 rounded">
                    {stripeStatus.accountId}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-700 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span>Account Details</span>
                      {stripeStatus.details?.details_submitted ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-700 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span>Charges Enabled</span>
                      {stripeStatus.details?.charges_enabled ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-700 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span>Payouts Enabled</span>
                      {stripeStatus.details?.payouts_enabled ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-700 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span>Overall Status</span>
                      {stripeStatus.isComplete ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={refreshStripeStatus}
                    disabled={loading}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                  
                  {!stripeStatus.isComplete && (
                    <Button 
                      onClick={handleStripeConnect}
                      disabled={loading}
                      className="bg-[#6772E5] hover:bg-[#6772E5]/90"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Complete Stripe Onboarding
                    </Button>
                  )}

                  {stripeStatus.isComplete && (
                    <Button
                      onClick={() => router.push("/coaching/create-listing")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Coaching Listing
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-300">
                  You haven&apos;t connected a Stripe account yet. To receive payments from students,
                  you&apos;ll need to complete the Stripe Connect onboarding process.
                </p>
                
                <Button 
                  onClick={handleStripeConnect}
                  disabled={loading}
                  className="bg-[#6772E5] hover:bg-[#6772E5]/90"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Connect with Stripe
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachSettingsPage; 