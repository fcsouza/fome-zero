import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeonHttp } from 'drizzle-orm/neon-http';
import { migrate as migrateNeonHttp } from 'drizzle-orm/neon-http/migrator';
import { drizzle as drizzleNodePostgres } from 'drizzle-orm/node-postgres';
import { migrate as migrateNodePostgres } from 'drizzle-orm/node-postgres/migrator';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'migrations' });

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const isLocalOrTest =
    process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

  logger.info('Running database migrations...');

  if (isLocalOrTest) {
    const db = drizzleNodePostgres(process.env.DATABASE_URL);
    await migrateNodePostgres(db, { migrationsFolder: './src/db/migrations' });
  } else {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzleNeonHttp(sql);
    await migrateNeonHttp(db, { migrationsFolder: './src/db/migrations' });
  }

  logger.info('Migrations completed successfully');
  process.exit(0);
};

runMigrations().catch((err) => {
  logger.error({ err }, 'Migration failed');
  process.exit(1);
});
