import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createTrialSubscription,
  getActiveSubscription,
  getCurrentSubscription,
  upgradeTrialToActive,
  cancelSubscription,
  getAllPlans,
  getSubscriptionWithPlan,
} from "./subscriptions";

export const subscriptionRouter = router({
  /**
   * Get all available plans
   */
  listPlans: publicProcedure.query(async () => {
    const allPlans = await getAllPlans();
    return allPlans.map((plan) => ({
      ...plan,
      features: JSON.parse(plan.features || "[]"),
    }));
  }),

  /**
   * Get current user subscription
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getCurrentSubscription(ctx.user.id);
    if (!subscription) return null;

    const withPlan = await getSubscriptionWithPlan(subscription.id);
    if (!withPlan) return null;

    return {
      ...withPlan.subscription,
      plan: {
        ...withPlan.plan,
        features: JSON.parse(withPlan.plan.features || "[]"),
      },
    };
  }),

  /**
   * Start a trial subscription
   */
  startTrial: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a subscription
      const existing = await getCurrentSubscription(ctx.user.id);
      if (existing) {
        throw new Error("User already has an active subscription");
      }

      await createTrialSubscription(ctx.user.id, input.planId);
      return { success: true };
    }),

  /**
   * Upgrade trial to paid subscription
   */
  upgradeToPaid: protectedProcedure
    .input(
      z.object({
        billingCycle: z.enum(["monthly", "annual"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await getCurrentSubscription(ctx.user.id);
      if (!subscription) {
        throw new Error("No subscription found");
      }

      if (subscription.status !== "trial") {
        throw new Error("Only trial subscriptions can be upgraded");
      }

      await upgradeTrialToActive(subscription.id, input.billingCycle);
      return { success: true };
    }),

  /**
   * Cancel subscription
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await getActiveSubscription(ctx.user.id);
    if (!subscription) {
      throw new Error("No active subscription found");
    }

    await cancelSubscription(subscription.id);
    return { success: true };
  }),
});
