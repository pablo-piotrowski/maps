import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import type { PlatformStats } from '@/types/user';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const sql = neon(DATABASE_URL);

export async function GET() {
  try {
    // Get basic platform statistics
    const basicStats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM fish_catches) as total_catches,
        (SELECT COUNT(DISTINCT fish) FROM fish_catches WHERE fish IS NOT NULL) as total_species_caught,
        (SELECT COUNT(DISTINCT lake_id) FROM fish_catches WHERE lake_id IS NOT NULL) as total_lakes_with_catches
    `;

    // Get biggest fish
    const biggestFish = await sql`
      SELECT 
        fc.fish as species,
        fc.weight,
        fc.length,
        u.username as caught_by,
        fc.date,
        fc.lake_id as lake
      FROM fish_catches fc
      LEFT JOIN users u ON fc.user_id = u.id
      WHERE fc.weight IS NOT NULL
      ORDER BY fc.weight DESC
      LIMIT 1
    `;

    // Get most popular species (top 5)
    const popularSpecies = await sql`
      SELECT 
        fish as species,
        COUNT(*) as catch_count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM fish_catches WHERE fish IS NOT NULL)), 1) as percentage
      FROM fish_catches
      WHERE fish IS NOT NULL
      GROUP BY fish
      ORDER BY catch_count DESC
      LIMIT 5
    `;

    // Get most active lakes (top 5)
    const activeLakes = await sql`
      SELECT 
        lake_id,
        COUNT(*) as catch_count,
        COUNT(DISTINCT user_id) as unique_anglers
      FROM fish_catches
      WHERE lake_id IS NOT NULL
      GROUP BY lake_id
      ORDER BY catch_count DESC
      LIMIT 5
    `;

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        (SELECT COUNT(*) FROM fish_catches WHERE date >= CURRENT_DATE - INTERVAL '1 day') as catches_last_24h,
        (SELECT COUNT(*) FROM fish_catches WHERE date >= CURRENT_DATE - INTERVAL '7 days') as catches_last_7d,
        (SELECT COUNT(*) FROM fish_catches WHERE date >= CURRENT_DATE - INTERVAL '30 days') as catches_last_30d,
        (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_last_30d
    `;

    // Construct response
    const platformStats: PlatformStats = {
      total_users: basicStats[0].total_users,
      total_catches: basicStats[0].total_catches,
      total_species_caught: basicStats[0].total_species_caught,
      total_lakes_with_catches: basicStats[0].total_lakes_with_catches,
      biggest_fish:
        biggestFish.length > 0
          ? {
              species: biggestFish[0].species,
              weight: biggestFish[0].weight,
              length: biggestFish[0].length,
              caught_by: biggestFish[0].caught_by || 'Anonimowy',
              date: biggestFish[0].date,
              lake: biggestFish[0].lake,
            }
          : null,
      most_popular_species: popularSpecies.map((species) => ({
        species: species.species,
        catch_count: species.catch_count,
        percentage: parseFloat(species.percentage as string),
      })),
      most_active_lakes: activeLakes.map((lake) => ({
        lake_id: lake.lake_id,
        catch_count: lake.catch_count,
        unique_anglers: lake.unique_anglers,
      })),
      recent_activity: {
        catches_last_24h: recentActivity[0].catches_last_24h,
        catches_last_7d: recentActivity[0].catches_last_7d,
        catches_last_30d: recentActivity[0].catches_last_30d,
        new_users_last_30d: recentActivity[0].new_users_last_30d,
      },
    };

    return NextResponse.json(platformStats);
  } catch (error) {
    console.error('Global stats API error:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać statystyk platformy' },
      { status: 500 }
    );
  }
}
