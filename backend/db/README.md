# DATABASE README

## Development Workflow

### 1. Start the database

Ensure Docker is running and start the database container.

```bash
npm run db:up
```

### 2. Schema Changes&Migrations

**A. For simple, non-destructive changes (e.g., adding a new field):**
Create a new migration file.

```bash
npx prisma migrate dev --name <your_migration_name>
```

**B. For major refactoring or to start fresh (DESTRUCTIVE):**
This will drop the database, re-apply all migrations, and run seeds.

```bash
npx prisma migrate reset
```

### 3. Update vector in docker

Run this command, and after modifying the migration file, add this command to the migration file.

```bash
npm run db:init-vector
```

```bash
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;
```

Save the file if necessary. **B. For major refactoring or to start fresh (DESTRUCTIVE):**

### 4. Seed Initial Data

To populate the database with initial data from `db/init.sql`. This is usually done after `migrate reset`.

```bash
npm run db:seed
```
### 5. Update data embeddings of departments

Run this command to ensure table embedding is created.

```bash
npm run seed:dept
```

### 6. Generate Prisma Client

After any schema change, Prisma Client needs to be regenerated. `migrate dev` and `migrate reset` do this automatically. If you need to do it manually:

```bash
npx prisma generate
```

### 7. View the Database

Open Prisma Studio in your browser to view and edit data.

```bash
npx prisma studio
```

### 8. Redis
Pull Redis Stack image

```bash
docker pull redis/redis-stack-server:latest
```

Run Redis container
```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

### 9. Change version

If there's a version error when the project is first created, run that command to fix the error.

```bash
npm run db:change-version
```