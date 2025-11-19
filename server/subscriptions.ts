import { eq, and, lt, gt } from "drizzle-orm";
import { plans, subscriptions, users } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a trial subscription for a new user
 */
export async function createTrialSubscription(userId: number, planId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const trialEndDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

  const result = await db.insert(subscriptions).values({
    userId,
    planId,
    status: "trial",
    billingCycle: "monthly",
    trialStartDate: now,
    trialEndDate,
  });

  return result;
}

/**
 * Get active subscription for a user
 */
export async function getActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get current subscription (trial or active)
 */
export async function getCurrentSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "trial")
      )
    )
    .limit(1);

  if (result.length > 0) return result[0];

  return await getActiveSubscription(userId);
}

/**
 * Upgrade trial to active subscription
 */
export async function upgradeTrialToActive(
  subscriptionId: number,
  billingCycle: "monthly" | "annual"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const endDate = new Date(
    now.getTime() +
      (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
  );

  await db
    .update(subscriptions)
    .set({
      status: "active",
      billingCycle,
      startDate: now,
      endDate,
    })
    .where(eq(subscriptions.id, subscriptionId));
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}

/**
 * Check and expire subscriptions that have passed their end date
 */
export async function expireSubscriptions() {
  const db = await getDb();
  if (!db) return;

  const now = new Date();

  // Find subscriptions that should be expired
  const expiredSubs = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.status, "active"),
        lt(subscriptions.endDate, now)
      )
    );

  // Update their status to expired
  if (expiredSubs.length > 0) {
    await db
      .update(subscriptions)
      .set({ status: "expired" })
      .where(
        and(
          eq(subscriptions.status, "active"),
          lt(subscriptions.endDate, now)
        )
      );
  }

  // Find trial subscriptions that should be expired
  const expiredTrials = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.status, "trial"),
        lt(subscriptions.trialEndDate, now)
      )
    );

  // Update their status to expired
  if (expiredTrials.length > 0) {
    await db
      .update(subscriptions)
      .set({ status: "expired" })
      .where(
        and(
          eq(subscriptions.status, "trial"),
          lt(subscriptions.trialEndDate, now)
        )
      );
  }
}

/**
 * Get plan by ID
 */
export async function getPlanById(planId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(plans)
    .where(eq(plans.id, planId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all plans
 */
export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(plans);
}

/**
 * Get subscription with plan details
 */
export async function getSubscriptionWithPlan(subscriptionId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({
      subscription: subscriptions,
      plan: plans,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.id, subscriptionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
