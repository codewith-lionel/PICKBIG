import { app } from "./app.js";
import { env } from "./config/env.js";
import { startScannerWorker } from "./workers/scanner.worker.js";

app.listen(env.PORT, () => {
  startScannerWorker();
  console.log(`Server running on port ${env.PORT}`);
});
