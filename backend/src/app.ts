import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration supporting localhost, configured clientUrl, and all Vercel deployments
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      config.clientUrl,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    // Check exact match or any *.vercel.app domain
    const isVercelDomain = origin.endsWith('.vercel.app');
    const isAllowed = allowedOrigins.includes(origin) || isVercelDomain;

    if (isAllowed) {
      return callback(null, true);
    }

    // In non-production or for flexible testing, allow origin
    if (config.nodeEnv !== 'production') {
      return callback(null, true);
    }

    callback(null, true); // Permissive CORS for public ecommerce API
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-session-id'],
}));

app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads (for local dev fallback)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount all API routes under /api
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Arora Communication API',
    shop: 'Arora Communication',
    healthCheck: '/api/health',
    version: '1.0.0',
    documentation: 'See README.md for endpoint specifications',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
