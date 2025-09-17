import "dotenv/config";
import env from "./src/config/environment.mjs";
import app from "./app.mjs";
import { logger } from "./src/middleware/logger.mjs";

app.listen(env.port, () => {
  logger.info("Database has been connected successfully");
  logger.info(`Server is running on port ${env.port}`);
});
