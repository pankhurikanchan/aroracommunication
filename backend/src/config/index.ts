import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Strict validation for production JWT Secret
const DEFAULT_DEV_JWT_SECRET = 'arora_super_secret_jwt_key_2026_modern_electronics_store';
let jwtSecret = process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_DEV_JWT_SECRET)) {
  console.warn(
    '⚠️ [SECURITY WARNING] Production environment detected with default or missing JWT_SECRET! Ensure a cryptographically secure JWT_SECRET is configured in production environment variables.'
  );
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  isProduction,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  directUrl: process.env.DIRECT_URL || '',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'product-images',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_arora_mock_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_arora_mock_secret',
  },
  email: {
    user: process.env.EMAIL_USER || 'auroramobilesandgadgethub@gmail.com',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || '"Arora Mobile Hub" <auroramobilesandgadgethub@gmail.com>',
  },
};
