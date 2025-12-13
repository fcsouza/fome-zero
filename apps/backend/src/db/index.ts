import { resolve } from 'node:path';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import {
  drizzle as drizzleNeonHttp,
  type NeonHttpDatabase,
} from 'drizzle-orm/neon-http';
import {
  drizzle as drizzleNodePostgres,
  type NodePgDatabase,
} from 'drizzle-orm/node-postgres';
// biome-ignore lint/performance/noNamespaceImport: _
import * as schema from './schema';

// Load .env file from the backend directory, not the current working directory
// This ensures tests work when run from the root directory
const backendDir = resolve(import.meta.dir, '../..');
config({ path: resolve(backendDir, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const isLocalOrTest =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

let db: NodePgDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

if (isLocalOrTest) {
  db = drizzleNodePostgres(process.env.DATABASE_URL, { schema });
} else {
  const sql = neon(process.env.DATABASE_URL);
  db = drizzleNeonHttp(sql, { schema });
}

export { db };
