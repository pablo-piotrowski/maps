import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { CreateFishCatch, FishCatchResponse } from "@/types/fish-catch";
import { verifyToken, extractTokenFromHeader } from "@/lib/jwt";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token",
        },
        { status: 401 }
      );
    }

    const userId = parseInt(decoded.sub);
    const body = (await request.json()) as CreateFishCatch;

    // Validate required fields
    if (!body.lake_id || !body.fish || !body.date || !body.time) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: lake_id, fish, date, time",
        },
        { status: 400 }
      );
    }

    // Insert the fish catch into the database
    const query = `
      INSERT INTO fish_catches (lake_id, fish, length, weight, date, time, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      body.lake_id,
      body.fish,
      body.length || null,
      body.weight || null,
      body.date,
      body.time,
      userId,
    ];

    const result = await pool.query(query, values);
    const newFishCatch = result.rows[0];

    const response: FishCatchResponse = {
      success: true,
      data: newFishCatch,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating fish catch:", error);

    const response: FishCatchResponse = {
      success: false,
      error: "Failed to create fish catch record",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token",
        },
        { status: 401 }
      );
    }

    const userId = parseInt(decoded.sub);
    const { searchParams } = new URL(request.url);
    const lakeId = searchParams.get("lake_id");

    // Query to get fish catches - left join with users to handle null user_id
    let query = `
      SELECT fc.*, u.username 
      FROM fish_catches fc
      LEFT JOIN users u ON fc.user_id = u.id
      WHERE (
        fc.user_id = $1 
        OR fc.user_id IS NULL 
        OR (u.privacy_settings->>'catches_public')::boolean = true
      )
    `;
    const values: (string | number)[] = [userId];

    if (lakeId) {
      query += " AND fc.lake_id = $2";
      values.push(lakeId);
    }

    query += " ORDER BY fc.date DESC, fc.time DESC";

    const result = await pool.query(query, values);

    const response: FishCatchResponse = {
      success: true,
      data: result.rows,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching fish catches:", error);

    const response: FishCatchResponse = {
      success: false,
      error: "Failed to fetch fish catch records",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
