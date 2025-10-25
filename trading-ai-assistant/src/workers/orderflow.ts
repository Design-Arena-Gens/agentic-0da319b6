import "dotenv/config";
import { createOrderFlowWorker, orderFlowQueueEvents } from "../lib/queue";
import { generateSignalFromOrderFlow } from "../lib/ai/decisionAgent";

try {
  createOrderFlowWorker(async (job) => {
    const { orderFlowEventId } = job.data;
    await generateSignalFromOrderFlow(orderFlowEventId);
  });

  orderFlowQueueEvents?.on("failed", ({ jobId, failedReason }) => {
    console.error("[orderflow worker] job failed", jobId, failedReason);
  });

  console.log("Orderflow worker running...");
} catch (error) {
  console.error("Unable to start orderflow worker", error);
}
