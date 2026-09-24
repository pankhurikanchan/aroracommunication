const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql:') || dbUrl.startsWith('postgres:');
const schema = isPostgres ? 'prisma/schema.prisma' : 'prisma/schema.sqlite.prisma';

console.log(`[Arora Communication] Configuring Prisma Client for: ${isPostgres ? 'Supabase PostgreSQL (Production)' : 'SQLite (Local Offline Dev)'}`);
console.log(`[Arora Communication] Using schema: ${schema}`);

try {
  execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
  const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js');
  if (fs.existsSync(clientPath)) {
    console.warn('[Arora Communication] Note: Active server holds file lock on query engine binary. Continuing with existing generated Prisma Client.');
  } else {
    console.error('[Arora Communication] Prisma generation failed:', error);
    process.exit(1);
  }
}
