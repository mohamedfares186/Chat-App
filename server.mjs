import "dotenv/config";
import envConfig from "./config/environment.mjs";
import app from "./app.mjs";
import { logger } from "./middleware/logger.mjs";

app.listen(envConfig.port, () => {
  logger.info(`Server is running on port ${envConfig.port}`);
  logger.info(`Database has been connected successfully`);
});
