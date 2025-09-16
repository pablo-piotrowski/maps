# Fish Catches Database Setup

This document describes how to set up the `fish_catches` table in your Neon database on Vercel.

## Table Structure

The `fish_catches` table contains the following fields:

| Field        | Type               | Description                                     |
| ------------ | ------------------ | ----------------------------------------------- |
| `id`         | SERIAL PRIMARY KEY | Auto-incrementing unique identifier             |
| `lake_id`    | VARCHAR(255)       | Identifier for the lake (matches your map data) |
| `fish`       | VARCHAR(100)       | Type/species of fish caught                     |
| `length`     | DECIMAL(5,2)       | Length of fish in centimeters (optional)        |
| `weight`     | DECIMAL(6,3)       | Weight of fish in kilograms (optional)          |
| `date`       | DATE               | Date when fish was caught                       |
| `time`       | TIME               | Time when fish was caught                       |
| `created_at` | TIMESTAMP          | Record creation timestamp                       |
| `updated_at` | TIMESTAMP          | Record last update timestamp                    |

## Setup Instructions

### 1. Connect to your Neon Database

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to the "Storage" tab
4. Find your Neon database connection

### 2. Execute the SQL Script

Run the SQL script located in `/database/create_fish_catches_table.sql`:

```bash
# If using psql command line
psql "your-neon-connection-string" -f database/create_fish_catches_table.sql

# Or copy and paste the SQL commands directly in your Neon dashboard
```

### 3. Verify Table Creation

After running the script, verify the table was created:

```sql
-- Check if table exists
SELECT table_name FROM information_schema.tables
WHERE table_name = 'fish_catches';

-- View table structure
\d fish_catches;
```

## Usage Examples

### Insert a new fish catch

```sql
INSERT INTO fish_catches (lake_id, fish, length, weight, date, time)
VALUES ('lake_001', 'Bass', 35.50, 2.250, '2024-09-16', '14:30:00');
```

### Query fish catches by lake

```sql
SELECT * FROM fish_catches
WHERE lake_id = 'lake_001'
ORDER BY date DESC, time DESC;
```

### Get statistics by fish type

```sql
SELECT
    fish,
    COUNT(*) as catch_count,
    AVG(length) as avg_length,
    AVG(weight) as avg_weight
FROM fish_catches
GROUP BY fish
ORDER BY catch_count DESC;
```

## Environment Variables

Make sure your `.env.local` file contains the Neon database connection string:

```env
DATABASE_URL="your-neon-connection-string"
```

## Next Steps

After setting up the database, you can:

1. Create API routes in Next.js to handle CRUD operations
2. Add a form to your map modal to log fish catches
3. Display catch history for each lake
4. Create analytics and statistics pages
