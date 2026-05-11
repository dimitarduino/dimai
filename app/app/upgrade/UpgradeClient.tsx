"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Script from 'next/script';
import { toast } from 'sonner';
import Link from 'next/link';

type FreemiusSandboxParams = Record<string, unknown> & { error?: unknown };

/** Aligns with /api/subscription/get JSON shape (see PortalClient). */
type SubscriptionPayload = {
  currentPlan?: {
    name?: string;
    status?: string;
    billing_cycle?: string;
    id?: string | number;
  } | null;
};

function Upgrade() {
  const { user, isLoaded } = useUser() ?? { user: null, isLoaded: false };
  const handlersRef = useRef({});
  const sandboxParamsRef = useRef<FreemiusSandboxParams | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionPayload | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Check if sandbox mode is enabled
  // Set NEXT_PUBLIC_FREEMIUS_SANDBOX_ENABLED=true in .env.local for development
  // Remove or set to false for production
  const isSandboxEnabled = 
    process.env.NEXT_PUBLIC_FREEMIUS_SANDBOX_ENABLED === 'true' ||
    process.env.NODE_ENV === 'development';

  // Freemius configuration - these should be set in your environment variables
  const FREEMIUS_CONFIG = {
    product_id: process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID || '23106',
    public_key: process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY || 'pk_df90c0ac8a3afe8a0fda368859dd6',
    image: process.env.NEXT_PUBLIC_LOGO_URL || 'https://dimnai.com/favicon.png',
    plans: {
      basic: process.env.NEXT_PUBLIC_FREEMIUS_PLAN_BASIC || '38755',
      pro: process.env.NEXT_PUBLIC_FREEMIUS_PLAN_PRO || '38753',
      enterprise: process.env.NEXT_PUBLIC_FREEMIUS_PLAN_ENTERPRISE || '38754',
    }
  };

  const plans = [
    {
      id: 'basic',
      name: "Basic",
      price: 3,
      credits: 100,
      description: "Perfect for getting started",
      features: [
        "100 credits per month",
        "Access to all AI tools",
        "Standard processing speed",
        "Community support",
        "Basic AI models",
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: "Pro",
      price: 19,
      credits: 100,
      description: "For creators and professionals",
      features: [
        "100 credits per month",
        "All Basic features",
        "Priority processing",
        "Higher quality outputs",
        "Advanced AI models",
        "Extended video length",
        "Commercial license",
        "Email support",
        "Early access to new features",
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      price: 99,
      credits: 650, // Large number for "unlimited" feel
      description: "For teams and businesses",
      features: [
        "650 credits per month",
        "All Pro features",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Custom training",
        "On-premise deployment options",
      ],
      popular: false,
    },
  ];

  // Initialize Freemius handlers when script loads
  const initializeHandlers = () => {
    const fs = typeof window !== 'undefined' ? window.FS : undefined;
    if (fs?.Checkout) {
      plans.forEach((plan) => {
        if (!handlersRef.current[plan.id]) {
          try {
            handlersRef.current[plan.id] = new fs.Checkout({
              product_id: FREEMIUS_CONFIG.product_id,
              plan_id: FREEMIUS_CONFIG.plans[plan.id],
              public_key: FREEMIUS_CONFIG.public_key,
              image: FREEMIUS_CONFIG.image
            });
          } catch (error) {
            console.error(`Error initializing Freemius handler for ${plan.id}:`, error);
          }
        }
      });
    }
  };

  // Fetch sandbox parameters if sandbox mode is enabled
  useEffect(() => {
    if (isSandboxEnabled) {
      console.log('Fetching sandbox params...');
      fetch('/api/freemius-sandbox')
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data && !data.error) {
            sandboxParamsRef.current = data;
            console.log('✅ Sandbox params loaded successfully:', data);
          } else {
            console.error('❌ Failed to load sandbox params:', data);
            sandboxParamsRef.current = null;
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching sandbox params:', error);
          sandboxParamsRef.current = null;
        });
    } else {
      console.log('Sandbox mode is disabled');
    }
  }, [isSandboxEnabled]);

  useEffect(() => {
    // Try to initialize immediately if script is already loaded
    initializeHandlers();
    
    // Also try after a short delay in case script is still loading
    const timeout = setTimeout(() => {
      initializeHandlers();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Fetch current subscription
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoadingSubscription(true);
      const response = await fetch('/api/subscription/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
        }),
      });

      const data = await response.json();

      if (response.ok && data.currentPlan) {
        setCurrentSubscription(data as SubscriptionPayload);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const addCreditsToDatabase = async (email, credits) => {
    try {
      const response = await fetch('/api/add-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          credits: credits,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add credits');
      }

      console.log('Credits added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding credits:', error);
      throw error;
    }
  };

  const handlePurchase = async (planId) => {
    // Try to initialize handlers if not already done
    const fs = typeof window !== 'undefined' ? window.FS : undefined;
    if (fs?.Checkout) {
      initializeHandlers();
    }

    const handler = handlersRef.current[planId];
    if (!handler) {
      console.error('Freemius handler not initialized for plan:', planId);
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    // Get the plan details
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      console.error('Plan not found:', planId);
      return;
    }

    // Get user email - prefer from Freemius response, fallback to Clerk user
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Fetch sandbox params if enabled (wait for them to load)
    let sandboxParams: FreemiusSandboxParams | null = null;
    if (isSandboxEnabled) {
      // If not already loaded, fetch them now
      if (!sandboxParamsRef.current) {
        try {
          const response = await fetch('/api/freemius-sandbox');
          const data = await response.json();
          if (data && !data.error) {
            sandboxParamsRef.current = data;
            sandboxParams = data;
            console.log('Sandbox params loaded:', data);
          } else {
            console.warn('Sandbox params not available:', data);
            console.warn('Proceeding without sandbox mode');
          }
        } catch (error) {
          console.error('Error fetching sandbox params:', error);
          console.warn('Proceeding without sandbox mode');
        }
      } else {
        sandboxParams = sandboxParamsRef.current;
        console.log('Using cached sandbox params:', sandboxParams);
      }
    }

    // Prepare checkout options
    const checkoutOptions: {
      name: string;
      licenses: number;
      purchaseCompleted: (response: any) => Promise<void>;
      success: (response: any) => Promise<void>;
      sandbox?: FreemiusSandboxParams;
    } = {
      name: 'DimnAI',
      licenses: 1,
      purchaseCompleted: async (response) => {
          // The logic here will be executed immediately after the purchase confirmation
          console.log('Purchase completed:', response);
          console.log('User email:', response.user.email);
          console.log('License key:', response.license?.key || 'N/A');
          
          // Add credits to database using email from Freemius response
          const emailToUse = response.user.email || userEmail;
          const licenseKey = response.license?.key;
          
          if (emailToUse) {
            try {
              // Add credits
              await addCreditsToDatabase(emailToUse, plan.credits);
              
              // Store license key and activate subscription
              if (licenseKey) {
                try {
                  await fetch('/api/subscription/store-license', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: emailToUse,
                      licenseKey: licenseKey,
                      planId: plan.id,
                    }),
                  });
                } catch (error) {
                  console.error('Failed to store license key:', error);
                }
              }
              
              alert(`Payment successful! ${plan.credits} credits have been added to your account.`);
              
              // Refresh subscription data
              await fetchCurrentSubscription();
            } catch (error) {
              console.error('Failed to add credits:', error);
              alert('Payment successful, but there was an issue adding credits. Please contact support.');
            }
          } else {
            console.error('No email available to add credits');
            alert('Payment successful, but we could not identify your account. Please contact support.');
          }
        },
        success: async (response) => {
          // The logic here will be executed after the customer closes the checkout, 
          // after a successful purchase
          console.log('Checkout closed after successful purchase:', response);
          console.log('User email:', response.user.email);
          console.log('License key:', response.license?.key || 'N/A');
          
          // Add credits to database using email from Freemius response
          // const emailToUse = response.user.email || userEmail;
          // if (emailToUse) {
          //   try {
          //     await addCreditsToDatabase(emailToUse, plan.credits);
          //     // Optionally refresh the page or update UI to show new credits
          //     // window.location.reload();
          //   } catch (error) {
          //     console.error('Failed to add credits:', error);
          //   }
          // }
        }
    };

    // IMPORTANT: Only add sandbox config in development/sandbox mode
    // Remove sandbox configuration before deployment to production,
    // otherwise, users will be able to upgrade with dummy credit-cards.
    if (isSandboxEnabled && sandboxParams) {
      // Ensure sandboxParams is an object and not an error
      if (typeof sandboxParams === 'object' && !sandboxParams.error) {
        checkoutOptions.sandbox = sandboxParams;
        console.log('✅ Sandbox mode enabled - test cards will be accepted');
        console.log('Sandbox config:', JSON.stringify(sandboxParams, null, 2));
      } else {
        console.error('❌ Invalid sandbox params format:', sandboxParams);
        alert('Sandbox mode is enabled but configuration is invalid. Check console for details.');
      }
    } else if (isSandboxEnabled && !sandboxParams) {
      console.warn('⚠️ Sandbox mode is enabled but params are not available');
      console.warn('Check that NEXT_PUBLIC_FREEMIUS_SANDBOX_ENABLED=true and API is working');
    }

    console.log('Opening checkout with options:', {
      ...checkoutOptions,
      sandbox: checkoutOptions.sandbox ? '✅ Present' : '❌ Not present'
    });

    try {
      handler.open(checkoutOptions);
    } catch (error) {
      console.error('Error opening Freemius checkout:', error);
      alert('An error occurred while opening the checkout. Please try again.');
    }
  };

  if (!isLoaded) return null;

  return (
    <>
      <Script
        src="https://checkout.freemius.com/js/v1/"
        strategy="lazyOnload"
        onLoad={initializeHandlers}
        onError={(e) => {
          console.error('Failed to load Freemius script:', e);
        }}
      />
      
      <div className='dashboard px-6 py-8'>
        <div className="max-w-7xl mx-auto">
          {/* Sandbox Mode Warning - Only shown in development */}
          {isSandboxEnabled && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
              ⚠️ SANDBOX MODE ENABLED - Using test payment methods. Remove NEXT_PUBLIC_FREEMIUS_SANDBOX_ENABLED from production!
              </p>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className='font-bold text-4xl md:text-5xl text-primary mb-4'>
              Upgrade Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Unlock more powerful AI tools, faster processing, and exclusive premium features.
            </p>
            
            {/* Current Subscription Info */}
            {loadingSubscription ? (
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading subscription...</span>
              </div>
            ) : currentSubscription?.currentPlan ? (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Current Plan: <span className="text-primary">{currentSubscription.currentPlan.name}</span></p>
                  <p className="text-xs text-muted-foreground">
                    {currentSubscription.currentPlan.status === 'active' ? 'Active' : currentSubscription.currentPlan.status}
                    {currentSubscription.currentPlan.billing_cycle && ` • ${currentSubscription.currentPlan.billing_cycle}`}
                  </p>
                </div>
                <Link href="/app/portal">
                  <Button variant="outline" size="sm">Manage</Button>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              // Check if this is the current plan by comparing Freemius plan IDs
              const freemiusPlanId = FREEMIUS_CONFIG.plans[plan.id];
              const isCurrentPlan = currentSubscription?.currentPlan && 
                (freemiusPlanId === currentSubscription.currentPlan.id?.toString() ||
                 freemiusPlanId === currentSubscription.currentPlan.id);
              
              return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""} ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white">
                    Current Plan
                  </Badge>
                )}
                {plan.popular && !isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <div className="w-full space-y-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Current Plan
                      </Button>
                      <Link href="/app/portal" className="w-full">
                        <Button
                          className="w-full"
                          variant="secondary"
                        >
                          Manage Subscription
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(plan.id)}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      id={`purchase-${plan.id}`}
                    >
                      {currentSubscription?.currentPlan ? 'Switch to ' : 'Buy '}{plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </div>
    </>
  )
}

export default Upgrade