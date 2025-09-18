import { NextResponse } from "next/server";

export async function POST() {
  try {
    // For JWT-based auth, logout is typically handled client-side by removing the token
    // However, we can provide a consistent API response
    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
