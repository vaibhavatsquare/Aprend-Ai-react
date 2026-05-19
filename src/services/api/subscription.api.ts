import { fetch } from "@/src/libs/helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckoutRequest {
  plan: "MONTHLY" | "YEARLY";
  planType: "MONTHLY" | "YEARLY";
  countryCode: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutSessionId: string;
  sessionId: string;
  url: string;
  sessionUrl: string;
  publishableKey: string;
}

export interface SubscriptionHistory {
  id: string;
  userSubscriptionId: string;
  stripeInvoiceId: string;
  currency: string;
  grossAmount: number;
  status: string;
  failedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDetails {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  planType: string;
  currency: string;
  price: number;
  countryCode: string;
  purchasedAt: string;
  endsAt: string;
  pausedAt: string | null;
  resumedAt: string | null;
  cancelledAt: string | null;
  subscriptionStatus: "ACTIVE" | "CANCELLED" | "PAUSED";
  status: "ENABLED" | "DISABLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  history: SubscriptionHistory[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

// GET current subscription details
export const getSubscription = async (): Promise<SubscriptionDetails | null> => {
  try {
    return await fetch<SubscriptionDetails>({
      url: "/subscription",
      method: "GET",
    });
  } catch {
    return null; // user has no subscription yet
  }
};

// POST create Stripe checkout session
export const createCheckoutSession = async (
  data: CheckoutRequest
): Promise<CheckoutResponse> => {
  return fetch<CheckoutResponse>({
    url: "/subscription/checkout",
    method: "POST",
    data,
  });
};

// POST cancel active subscription
export const cancelSubscription = async (): Promise<void> => {
  return fetch({
    url: "/subscription/cancel",
    method: "POST",
    data: { immediate: false },
  });
};