import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Allow inline styles & scripts from React/Vite build
}));

// CORS configuration supporting localhost, custom domains, and AWS/Vercel deployments
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
      'http://localhost:5000',
      'http://127.0.0.1:5000',
    ];

    const isVercelDomain = origin.endsWith('.vercel.app');
    const isAwsDomain = origin.endsWith('.amazonaws.com');
    const isAllowed = allowedOrigins.includes(origin) || isVercelDomain || isAwsDomain;

    if (isAllowed || config.nodeEnv !== 'production') {
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

// Serve Frontend SPA if built (frontend/dist or local public)
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
      message: 'Welcome to Arora Communication API',
      shop: 'Arora Communication',
      healthCheck: '/api/health',
      version: '1.0.0',
      documentation: 'See README.md for endpoint specifications',
    });
  });
}

// Global Error Handler
app.use(errorHandler);

export default app;
