"use client"
import React, { useEffect, useState, useContext } from 'react'
import { useUser } from '@clerk/nextjs';
import { useUserDetail } from '@/app/_context/UserDetailContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  User, 
  Mail, 
  Calendar, 
  XCircle, 
  CheckCircle, 
  Key,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function PortalClient() {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useUserDetail();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
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

      if (response.ok) {
        setSubscription(data);
      } else {
        console.error('Error fetching subscription:', data.error);
        toast.error('Failed to load subscription information');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    try {
      setCanceling(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          licenseKey: subscription?.licenseKey, // If you store license key
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription canceled successfully');
        await fetchSubscription();
        // Refresh user detail context
        if (setUserDetail) {
          const updatedUser = { ...userDetail, pretplata: false };
          setUserDetail(updatedUser);
        }
      } else {
        toast.error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  const handleRegisterSubscription = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !licenseKey.trim()) {
      toast.error('Please enter a valid license key');
      return;
    }

    try {
      setRegistering(true);
      const response = await fetch('/api/subscription/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          licenseKey: licenseKey.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Subscription registered successfully');
        setLicenseKey('');
        setShowRegisterForm(false);
        await fetchSubscription();
        // Refresh user detail context
        if (setUserDetail) {
          const updatedUser = { ...userDetail, pretplata: true };
          setUserDetail(updatedUser);
        }
      } else {
        toast.error(data.error || 'Failed to register subscription');
      }
    } catch (error) {
      console.error('Error registering subscription:', error);
      toast.error('Failed to register subscription');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard px-6 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const hasSubscription = subscription?.currentPlan || subscription?.user?.subscription || userDetail?.pretplata;
  const userCredits = subscription?.user?.credits || userDetail?.credits || 0;
  const currentPlan = subscription?.currentPlan;

  return (
    <div className="dashboard px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Customer Portal
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, view account details, and update settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{user?.fullName || subscription?.user?.name || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userEmail}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Credits</Label>
                <p className="font-medium text-2xl text-primary">{userCredits}</p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription Status
              </CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {hasSubscription ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <Badge variant="default" className="bg-green-500">
                          {currentPlan?.status === 'active' ? 'Active' : currentPlan?.status || 'Active'}
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-gray-500" />
                        <Badge variant="secondary">
                          No Active Subscription
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {currentPlan ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Plan</Label>
                    <p className="font-medium text-lg">{currentPlan.name}</p>
                  </div>
                  {currentPlan.price && (
                    <div>
                      <Label className="text-muted-foreground">Price</Label>
                      <p className="font-medium">
                        ${currentPlan.price}
                        {currentPlan.billing_cycle && ` / ${currentPlan.billing_cycle}`}
                      </p>
                    </div>
                  )}
                  {currentPlan.expires_at && (
                    <div>
                      <Label className="text-muted-foreground">Next Billing Date</Label>
                      <p className="font-medium">
                        {new Date(currentPlan.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {currentPlan.license_key && (
                    <div>
                      <Label className="text-muted-foreground">License Key</Label>
                      <p className="font-mono text-xs bg-muted p-2 rounded break-all">
                        {currentPlan.license_key}
                      </p>
                    </div>
                  )}
                </div>
              ) : hasSubscription ? (
                <div>
                  <Label className="text-muted-foreground">Plan</Label>
                  <p className="font-medium">Premium Plan</p>
                </div>
              ) : (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    You don't have an active subscription. Upgrade to unlock premium features.
                  </p>
                  <Button asChild>
                    <Link href="/app/upgrade">Upgrade Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {hasSubscription && (
              <CardFooter className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/app/upgrade">
                    Change Plan
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="w-full"
                >
                  {canceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Register License Key */}
        {!hasSubscription && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Register License Key
              </CardTitle>
              <CardDescription>
                Already have a license key? Register it here to activate your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showRegisterForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowRegisterForm(true)}
                  className="w-full"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Register License Key
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="licenseKey">License Key</Label>
                    <Input
                      id="licenseKey"
                      type="text"
                      placeholder="Enter your license key"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRegisterSubscription}
                      disabled={registering || !licenseKey.trim()}
                      className="flex-1"
                    >
                      {registering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRegisterForm(false);
                        setLicenseKey('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Billing Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Billing & Support
            </CardTitle>
            <CardDescription>Manage billing and get help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Need Help?</p>
                <p className="text-sm text-muted-foreground">
                  For billing questions, subscription changes, or technical support, please contact our support team.
                </p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/app/upgrade">Upgrade Plan</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PortalClient;
