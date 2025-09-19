import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Nazwa użytkownika, email i hasło są wymagane" },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Nazwa użytkownika musi mieć od 3 do 50 znaków" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format adresu email" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 6 znaków" },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        {
          error:
            "Hasło musi zawierać co najmniej jedną wielką literę, jedną małą literę i jedną cyfrę",
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const usernameCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (usernameCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "Nazwa użytkownika jest już zajęta" },
        { status: 409 }
      );
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "Konto na ten adres email już istnieje" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, created_at, last_login) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    const user = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data and token
    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Błąd wewnętrzny serwera" },
      { status: 500 }
    );
  }
}
