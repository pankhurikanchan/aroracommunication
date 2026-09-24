import { app } from './app';
import { config } from './config';
import prisma from './utils/prisma';

const PORT = config.port;

// Only bind to port if not running in a Vercel serverless environment
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  ARORA COMMUNICATION BACKEND API RUNNING `);
    console.log(`  Port: http://localhost:${PORT}`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`=========================================`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down server gracefully...`);
    try {
      await prisma.$disconnect();
    } catch (e) {
      // ignore
    }
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

export default app;
