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

### 3. Seed Initial Data

To populate the database with initial data from `db/init.sql`. This is usually done after `migrate reset`.

```bash
npm run db:seed
```

### 4. Generate Prisma Client

After any schema change, Prisma Client needs to be regenerated. `migrate dev` and `migrate reset` do this automatically. If you need to do it manually:

```bash
npx prisma generate
```

### 5. View the Database

Open Prisma Studio in your browser to view and edit data.

```bash
npx prisma studio
```
