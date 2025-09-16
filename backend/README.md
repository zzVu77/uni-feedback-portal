# 1. Start the database

npm run db:up

# 2. Apply migrations from Prisma schema

npm run migration:generate

# 3. Seed initial data (if init.sql exists)

npm run db:seed

# 4. Verify the database has tables and data

npx prisma studio
