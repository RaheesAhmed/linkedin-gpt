"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Subscription {
  status: 'active' | 'cancelled' | 'none';
  planId?: string;
  expiresAt?: string;
}

const PRODUCT_ID = 'pgqFM4RebBN6QTqYIFzwWw=='

const plans = [
  {
    id: 'free',
    name: "Free Plan",
    description: "Basic features for getting started",
    price: "$0/month",
    features: [
      "5 GPT Conversations/day",
      "Basic Prompts",
      "Community Support"
    ],
    gumroadUrl: "",
  },
  {
    id: 'pro',
    name: "Pro Plan",
    description: "Perfect for professionals",
    price: "$10/month",
    features: [
      "Unlimited GPT Conversations",
      "Advanced Prompts",
      "Priority Support",
      "Custom Instructions"
    ],
    gumroadUrl: `https://linkedingpt.gumroad.com/l/subscribe?wanted=true&product_id=${PRODUCT_ID}`,
  }
]

export function SubscriptionPlans() {
  const [subscription, setSubscription] = useState<Subscription>({ status: 'none' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      if (data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (url: string) => {
    if (!url) return;

    // Open Gumroad in a new window
    const gumroadWindow = window.open(url, '_blank');

    // Poll for license key in URL when window is redirected back
    const pollForLicenseKey = setInterval(async () => {
      try {
        if (gumroadWindow?.closed) {
          clearInterval(pollForLicenseKey);
          return;
        }

        const currentUrl = gumroadWindow?.location.href;
        if (currentUrl?.includes('license_key=')) {
          clearInterval(pollForLicenseKey);
          gumroadWindow?.close();

          const urlParams = new URLSearchParams(new URL(currentUrl).search);
          const licenseKey = urlParams.get('license_key');

          if (licenseKey) {
            // Verify and update subscription
            const response = await fetch('/api/subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ licenseKey }),
            });

            const data = await response.json();
            if (data.success) {
              setSubscription(data.subscription);
              toast({
                title: "Success!",
                description: "Your subscription has been activated.",
              });
            } else {
              toast({
                title: "Error",
                description: "Failed to verify subscription. Please try again.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        // Ignore cross-origin errors while polling
      }
    }, 1000);

    // Clean up interval after 5 minutes
    setTimeout(() => clearInterval(pollForLicenseKey), 5 * 60 * 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-linkedin-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`p-6 ${subscription.planId === plan.id ? 'ring-2 ring-linkedin-blue' : ''}`}>
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-gray-500 mt-1">{plan.description}</p>
              <p className="text-3xl font-bold text-linkedin-blue mt-4">{plan.price}</p>
            </div>
            <ul className="mt-6 space-y-4 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {subscription.planId === plan.id || (plan.id === 'free' && !subscription.planId) ? (
                <Button className="w-full bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-not-allowed" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full bg-linkedin-blue hover:bg-linkedin-darkBlue"
                  onClick={() => handleUpgrade(plan.gumroadUrl)}
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
