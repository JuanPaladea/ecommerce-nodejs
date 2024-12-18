import app from "./app";
import { connectDatabase } from "./config/database";
import { PORT } from "./config/envs";
import logger from "./utils/logger";

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server: ", error);
  }
}

startServer();