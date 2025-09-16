import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { CreateFishCatch, FishCatchResponse } from "@/types/fish-catch";

// Create a connection pool to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
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
      INSERT INTO fish_catches (lake_id, fish, length, weight, date, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      body.lake_id,
      body.fish,
      body.length || null,
      body.weight || null,
      body.date,
      body.time,
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
    const { searchParams } = new URL(request.url);
    const lakeId = searchParams.get("lake_id");

    let query = "SELECT * FROM fish_catches";
    const values: string[] = [];

    if (lakeId) {
      query += " WHERE lake_id = $1";
      values.push(lakeId);
    }

    query += " ORDER BY date DESC, time DESC";

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
