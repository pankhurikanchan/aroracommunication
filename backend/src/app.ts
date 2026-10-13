import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestId';
import { apiLimiter } from './middleware/rateLimiter';

export const app = express();

// 1. Request Correlation ID
app.use(requestIdMiddleware);

// 2. Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Allows inline styles & scripts from modern Vite frontend builds
    hsts: config.isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  })
);

// 3. Robust CORS Policy
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps, curl, server-to-server requests without Origin header
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        config.clientUrl,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'http://localhost:8081',
      ];

      const isVercelDomain = origin.endsWith('.vercel.app');
      const isAwsDomain = origin.endsWith('.amazonaws.com');
      const isAllowed = allowedOrigins.includes(origin) || isVercelDomain || isAwsDomain;

      if (isAllowed || !config.isProduction) {
        return callback(null, true);
      }

      callback(null, true); // Public ecommerce API
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-session-id', 'x-request-id', 'x-guest-email', 'x-guest-phone'],
    exposedHeaders: ['X-Request-Id'],
  })
);

// 4. Request Logging & Body Parsers
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Serve local static uploads fallback
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 6. Global API Rate Limiting & Routes
app.use('/api', apiLimiter);
app.use('/api', apiRouter);

// Explicit 404 for unmatched /api routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    requestId: (req as any).id,
  });
});

// 7. Serve Frontend SPA if built (frontend/dist or local public)
const possibleFrontendPaths = [
  path.join(__dirname, '../../frontend/dist'),
  path.join(process.cwd(), '../frontend/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'public'),
];

let frontendDistPath: string | null = null;
for (const p of possibleFrontendPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    frontendDistPath = p;
    break;
  }
}

if (frontendDistPath) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath!, 'index.html'));
  });
} else {
  // API Welcome & Health Route when frontend is not built in the same folder
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Arora Communication Production API',
      shop: 'Arora Mobiles and Gadget Hub',
      endpoints: {
        health: '/api/health',
        v1: '/api/v1',
      },
      version: '1.0.0',
    });
  });
}

// 8. Global Standardized Error Handler
app.use(errorHandler);

export default app;
