'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

type Subscription = {
  id: string;
  plan: string;
  status: string;
  periodStart?: string;
  periodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  limits?: {
    projects?: number;
    storage?: number;
  };
};

const PLANS = [
  {
    name: 'basic',
    displayName: 'Basic',
    price: '$9.99',
    period: 'month',
    features: ['5 Projects', '10 GB Storage'],
  },
  {
    name: 'pro',
    displayName: 'Pro',
    price: '$19.99',
    period: 'month',
    features: ['20 Projects', '50 GB Storage', '14-day free trial'],
  },
];

function getStatusColorClass(status: string): string {
  if (status === 'active') {
    return 'text-green-400';
  }
  if (status === 'trialing') {
    return 'text-blue-400';
  }
  return 'text-yellow-400';
}

function getButtonText(
  isCurrentPlan: boolean,
  isUpgrading: boolean,
  hasActiveSubscription: boolean
): string {
  if (isCurrentPlan) {
    return 'Current Plan';
  }
  if (isUpgrading) {
    return 'Processing...';
  }
  if (hasActiveSubscription) {
    return 'Switch Plan';
  }
  return 'Subscribe';
}

export default function SubscriptionPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.push('/login');
      return;
    }

    try {
      const response = await authClient.subscription.list();
      if (response.error) {
        toastError('Failed to load subscriptions', response.error.message);
      } else if (response.data) {
        setSubscriptions(response.data as Subscription[]);
      }
    } catch (err) {
      toastError('An error occurred while loading subscriptions');
      logger.error({ err }, 'Subscription error');
    } finally {
      setLoading(false);
    }
  }, [isPending, session, router]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleUpgrade = async (planName: string) => {
    setProcessing(`upgrade-${planName}`);

    const activeSubscription = subscriptions.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );

    const loadingToastId = toastLoading('Initiating subscription...');

    try {
      const response = await authClient.subscription.upgrade({
        plan: planName,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?canceled=true`,
        subscriptionId: activeSubscription?.id,
      });

      toastDismiss(loadingToastId);

      if (response.error) {
        toastError('Failed to initiate subscription', response.error.message);
      } else if (response.data?.url) {
        toastSuccess('Redirecting to checkout...');
        window.location.href = response.data.url;
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An error occurred while processing subscription');
      logger.error({ err }, 'Upgrade error');
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    // biome-ignore lint: User confirmation dialog required
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription?'
    );
    if (!confirmed) {
      return;
    }

    setProcessing(`cancel-${subscriptionId}`);

    const loadingToastId = toastLoading('Canceling subscription...');

    try {
      const response = await authClient.subscription.cancel({
        subscriptionId,
        returnUrl: window.location.href,
      });

      toastDismiss(loadingToastId);

      if (response.error) {
        toastError('Failed to cancel subscription', response.error.message);
      } else {
        toastSuccess('Subscription canceled successfully');
        const listResponse = await authClient.subscription.list();
        if (listResponse.data) {
          setSubscriptions(listResponse.data as Subscription[]);
        }
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An error occurred while canceling subscription');
      logger.error({ err }, 'Cancel error');
    } finally {
      setProcessing(null);
    }
  };

  const handleBillingPortal = async () => {
    setProcessing('billing-portal');

    const loadingToastId = toastLoading('Opening billing portal...');

    try {
      const response = await authClient.subscription.billingPortal({
        returnUrl: window.location.href,
      });

      toastDismiss(loadingToastId);

      if (response.error) {
        toastError('Failed to open billing portal', response.error.message);
      } else if (response.data?.url) {
        toastSuccess('Redirecting to billing portal...');
        window.location.href = response.data.url;
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An error occurred while opening billing portal');
      logger.error({ err }, 'Billing portal error');
    } finally {
      setProcessing(null);
    }
  };

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing'
  );

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            className="text-blue-400 transition-colors hover:text-blue-300"
            href="/"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-8">
          <h1 className="mb-6 font-bold text-3xl text-white">
            Subscription Management
          </h1>

          {/* Current Subscription Status */}
          <div className="mb-8">
            <h2 className="mb-4 font-semibold text-white text-xl">
              Current Subscription
            </h2>
            {activeSubscription ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-white capitalize">
                      {activeSubscription.plan} Plan
                    </h3>
                    <p className="text-zinc-400">
                      Status:{' '}
                      <span
                        className={`capitalize ${getStatusColorClass(
                          activeSubscription.status
                        )}`}
                      >
                        {activeSubscription.status}
                      </span>
                    </p>
                  </div>
                  {activeSubscription.cancelAtPeriodEnd && (
                    <span className="rounded bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">
                      Cancels at period end
                    </span>
                  )}
                </div>

                {activeSubscription.periodEnd && (
                  <p className="mb-4 text-sm text-zinc-400">
                    {activeSubscription.cancelAtPeriodEnd
                      ? 'Expires'
                      : 'Renews'}{' '}
                    on{' '}
                    {new Date(
                      activeSubscription.periodEnd
                    ).toLocaleDateString()}
                  </p>
                )}

                {activeSubscription.limits && (
                  <div className="mb-4">
                    <p className="mb-2 font-medium text-sm text-zinc-400">
                      Plan Limits:
                    </p>
                    <ul className="space-y-1 text-sm text-zinc-300">
                      {activeSubscription.limits.projects && (
                        <li>• {activeSubscription.limits.projects} Projects</li>
                      )}
                      {activeSubscription.limits.storage && (
                        <li>
                          • {activeSubscription.limits.storage} GB Storage
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-600"
                    disabled={processing === 'billing-portal'}
                    onClick={handleBillingPortal}
                    type="button"
                  >
                    {processing === 'billing-portal'
                      ? 'Opening...'
                      : 'Manage Billing'}
                  </button>
                  {!activeSubscription.cancelAtPeriodEnd && (
                    <button
                      className="rounded bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-zinc-600"
                      disabled={
                        processing === `cancel-${activeSubscription.id}`
                      }
                      onClick={() => handleCancel(activeSubscription.id)}
                      type="button"
                    >
                      {processing === `cancel-${activeSubscription.id}`
                        ? 'Canceling...'
                        : 'Cancel Subscription'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
                <p className="text-zinc-400">
                  You don&apos;t have an active subscription. Choose a plan
                  below to get started.
                </p>
              </div>
            )}
          </div>

          {/* Available Plans */}
          <div>
            <h2 className="mb-4 font-semibold text-white text-xl">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {PLANS.map((plan) => {
                const isCurrentPlan =
                  activeSubscription?.plan === plan.name &&
                  (activeSubscription.status === 'active' ||
                    activeSubscription.status === 'trialing');
                const isUpgrading = processing === `upgrade-${plan.name}`;

                return (
                  <div
                    className={`rounded-lg border bg-zinc-900 p-6 ${
                      isCurrentPlan ? 'border-blue-500' : 'border-zinc-700'
                    }`}
                    key={plan.name}
                  >
                    <div className="mb-4">
                      <h3 className="mb-1 font-bold text-2xl text-white capitalize">
                        {plan.displayName}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-3xl text-white">
                          {plan.price}
                        </span>
                        <span className="text-zinc-400">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="mb-6 space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          className="flex items-center text-zinc-300"
                          key={feature}
                        >
                          <span className="mr-2 text-green-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full rounded px-4 py-2 font-medium transition-colors ${
                        isCurrentPlan
                          ? 'cursor-not-allowed bg-zinc-700 text-zinc-400'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={isCurrentPlan || isUpgrading}
                      onClick={() => handleUpgrade(plan.name)}
                      type="button"
                    >
                      {getButtonText(
                        isCurrentPlan,
                        isUpgrading,
                        !!activeSubscription
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
