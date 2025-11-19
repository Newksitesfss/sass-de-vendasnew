import { expireSubscriptions } from "./subscriptions.ts";

const checkSubscriptions = async () => {
  try {
    console.log("Checking for expired subscriptions...");
    await expireSubscriptions();
    console.log("✓ Subscription check completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error checking subscriptions:", error);
    process.exit(1);
  }
};

checkSubscriptions();
