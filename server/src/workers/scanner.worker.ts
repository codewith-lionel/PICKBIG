import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import { runScanner } from "../services/scanner.service.js";

export function startScannerWorker() {
  cron.schedule("0 8 * * *", async () => {
    const users = await prisma.user.findMany({ select: { id: true } });

    for (const user of users) {
      try {
        await runScanner(user.id);
      } catch (error) {
        console.error("Scanner run failed", user.id, error);
      }
    }
  });
}
