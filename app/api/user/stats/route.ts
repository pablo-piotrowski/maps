import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = parseInt(decoded.sub);

    // Get user statistics from the view
    const statsResult = await pool.query(
      "SELECT * FROM user_fishing_stats WHERE id = $1",
      [userId]
    );

    if (statsResult.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const stats = statsResult.rows[0];

    // Get recent catches for the user (last 10)
    const recentCatchesResult = await pool.query(
      `SELECT fc.*, 'Własny połów' as lake_name 
       FROM fish_catches fc 
       WHERE fc.user_id = $1 
       ORDER BY fc.date DESC, fc.time DESC 
       LIMIT 10`,
      [userId]
    );

    // Get favorite lakes (most catches)
    const favoriteLakesResult = await pool.query(
      `SELECT 
         lake_id,
         COUNT(*) as catch_count,
         MAX(fc.date) as last_visit
       FROM fish_catches fc 
       WHERE fc.user_id = $1 
       GROUP BY lake_id 
       ORDER BY catch_count DESC, last_visit DESC 
       LIMIT 5`,
      [userId]
    );

    // Get species breakdown
    const speciesBreakdownResult = await pool.query(
      `SELECT 
         fish as species,
         COUNT(*) as count,
         COALESCE(AVG(length), 0) as avg_length,
         COALESCE(AVG(weight), 0) as avg_weight,
         MAX(weight) as biggest_weight,
         MAX(length) as longest_length
       FROM fish_catches fc 
       WHERE fc.user_id = $1 
       GROUP BY fish 
       ORDER BY count DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          username: stats.username,
          total_catches: stats.total_catches,
          lakes_visited: stats.lakes_visited,
          species_caught: stats.species_caught,
          avg_weight: parseFloat(stats.avg_weight).toFixed(2),
          avg_length: parseFloat(stats.avg_length).toFixed(1),
          biggest_fish_weight: stats.biggest_fish_weight,
          longest_fish_length: stats.longest_fish_length,
          first_catch_date: stats.first_catch_date,
          last_catch_date: stats.last_catch_date,
        },
        recent_catches: recentCatchesResult.rows,
        favorite_lakes: favoriteLakesResult.rows,
        species_breakdown: speciesBreakdownResult.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}