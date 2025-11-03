# Database Setup Guide

## Prerequisites

You need a PostgreSQL database. Choose one of these options:

### Option 1: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL**:
   ```bash
   # macOS (using Homebrew)
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE sixty_community;
   CREATE USER sixty_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE sixty_community TO sixty_user;
   \q
   ```

3. **Update .env**:
   ```env
   DATABASE_URL="postgresql://sixty_user:your_secure_password@localhost:5432/sixty_community?schema=public"
   ```

### Option 2: Railway.app (Cloud Hosting)

1. **Sign up at Railway.app**: https://railway.app

2. **Create New Project** → **Provision PostgreSQL**

3. **Copy Connection String**:
   - Go to your PostgreSQL service
   - Click "Connect"
   - Copy the "Postgres Connection URL"

4. **Update .env**:
   ```env
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway"
   ```

### Option 3: Neon.tech (Serverless PostgreSQL)

1. **Sign up at Neon.tech**: https://neon.tech

2. **Create New Project**

3. **Copy Connection String**

4. **Update .env**:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
   ```

### Option 4: Supabase (Free Tier Available)

1. **Sign up at Supabase**: https://supabase.com

2. **Create New Project**

3. **Get Connection String**:
   - Go to Project Settings → Database
   - Copy "Connection string" (make sure to replace [YOUR-PASSWORD])

4. **Update .env**:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

## Running Migrations

After setting up your DATABASE_URL:

```bash
# Generate Prisma client
npx prisma generate

# Run all pending migrations
npx prisma migrate deploy

# Or create a new migration (development)
npx prisma migrate dev

# Open Prisma Studio to view data
npx prisma studio
```

## Verify Setup

```bash
# Test database connection
npx prisma db push

# Seed database (if seed script exists)
npm run db:seed
```

## Troubleshooting

### Error: "Error validating datasource"

**Problem**: DATABASE_URL is empty or invalid

**Solution**:
1. Check `.env` file exists and has `DATABASE_URL` set
2. Restart your development server after changing `.env`
3. Verify connection string format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

### Error: "Can't reach database server"

**Problem**: Database is not running or connection details are wrong

**Solution**:
1. **Local PostgreSQL**: Check service is running
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. **Cloud Database**: Verify connection string is correct and database is active

### Error: "SSL connection required"

**Problem**: Cloud databases often require SSL

**Solution**: Add `?sslmode=require` to connection string:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

## Current Schema

The database includes the following tables (as of Phase 7):

**Phase 1 - Foundation**:
- `users` - User accounts (Clerk integration)
- `communities` - Community organizations
- `community_members` - User roles in communities

**Phase 2 - Forums**:
- `posts` - Forum posts
- `comments` - Post comments
- `post_attachments` - File uploads

**Phase 3 - Version History**:
- `content_versions` - Post/comment revisions

**Phase 4 - Search & Notifications**:
- `notifications` - User notifications

**Phase 5 - Basic Courses**:
- `courses` - Course catalog
- `lessons` - Course lessons
- `course_progress` - Student progress tracking
- `certificates` - Course completion certificates

**Phase 6 - Monetization**:
- `payment_tiers` - Pricing tiers (Free + Paid)
- `subscriptions` - User subscriptions
- `coupons` - Discount codes

**Phase 7 - Multi-Space Layout** (NEW):
- `spaces` - Organizational spaces (nested 2 levels)
- `channels` - Discussion channels with permissions

## Migration History

View all applied migrations:
```bash
npx prisma migrate status
```

## Reset Database (⚠️ Destructive)

**WARNING**: This will delete ALL data!

```bash
# Reset database and re-run all migrations
npx prisma migrate reset

# Confirm when prompted
```

## Production Considerations

1. **Connection Pooling**: Use PgBouncer or Prisma Data Proxy for serverless environments

2. **Backup Strategy**: Set up automated backups before going live

3. **SSL Enforcement**: Always use SSL in production:
   ```env
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

4. **Environment Variables**: Use secure secret management (Railway secrets, Vercel env vars, etc.)

5. **Migration Strategy**: Test migrations on staging database first

---

**Need help?** Check the Prisma docs: https://www.prisma.io/docs
