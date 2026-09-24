const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgresql:') || dbUrl.startsWith('postgres:');
const schema = isPostgres ? 'prisma/schema.prisma' : 'prisma/schema.sqlite.prisma';

console.log(`================================================================`);
console.log(`  ARORA COMMUNICATION - DATABASE MIGRATION & SEED`);
console.log(`  Target: ${isPostgres ? 'Supabase PostgreSQL' : 'Local SQLite'}`);
console.log(`  Schema: ${schema}`);
console.log(`================================================================`);

try {
  console.log(`Step 1: Pushing database schema to ${isPostgres ? 'Supabase' : 'local file'}...`);
  execSync(`npx prisma db push --schema=${schema}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log(`Step 2: Seeding categories, brands, products, coupons, and demo accounts...`);
  execSync(`npx ts-node prisma/seed.ts`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log(`================================================================`);
  console.log(`  DATABASE SETUP COMPLETED SUCCESSFULLY!`);
  console.log(`================================================================`);
} catch (error) {
  console.error('[Arora Communication] Database setup failed:', error);
  process.exit(1);
}
