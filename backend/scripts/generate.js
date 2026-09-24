const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Safely load dotenv if present
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
} catch (e) {
  // In Vercel or production serverless, environment variables are already injected
}

const dbUrl = process.env.DATABASE_URL || '';
// In Vercel deployment, always use PostgreSQL schema
const isPostgres = Boolean(process.env.VERCEL || dbUrl.startsWith('postgresql:') || dbUrl.startsWith('postgres:'));
const schema = isPostgres ? 'prisma/schema.prisma' : 'prisma/schema.sqlite.prisma';

console.log(`[Arora Communication] Configuring Prisma Client for: ${isPostgres ? 'Supabase PostgreSQL (Production)' : 'SQLite (Local Offline Dev)'}`);
console.log(`[Arora Communication] Using schema: ${schema}`);

try {
  execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
  const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js');
  if (fs.existsSync(clientPath)) {
    console.warn('[Arora Communication] Note: Active process held file lock on query engine. Continuing with existing generated Prisma Client.');
  } else {
    console.error('[Arora Communication] Prisma generation failed:', error);
    process.exit(1);
  }
}
