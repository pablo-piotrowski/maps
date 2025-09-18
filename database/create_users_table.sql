-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    preferred_units VARCHAR(10) DEFAULT 'metric', -- 'metric' or 'imperial'
    privacy_settings JSONB DEFAULT '{"profile_public": true, "catches_public": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- Add constraint to check email format
ALTER TABLE users ADD CONSTRAINT valid_email 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add constraint to check username format (alphanumeric and underscore only)
ALTER TABLE users ADD CONSTRAINT valid_username 
    CHECK (username ~* '^[A-Za-z0-9_]{3,50}$');

-- Update fish_catches table to reference users
ALTER TABLE fish_catches 
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Create index for user_id in fish_catches
CREATE INDEX IF NOT EXISTS idx_fish_catches_user_id ON fish_catches(user_id);

-- Create user_sessions table for managing JWT tokens and sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_fishing_stats AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(fc.id) as total_catches,
    COUNT(DISTINCT fc.lake_id) as lakes_visited,
    COUNT(DISTINCT fc.fish) as species_caught,
    COALESCE(AVG(fc.weight), 0) as avg_weight,
    COALESCE(AVG(fc.length), 0) as avg_length,
    MAX(fc.weight) as biggest_fish_weight,
    MAX(fc.length) as longest_fish_length,
    MIN(fc.date) as first_catch_date,
    MAX(fc.date) as last_catch_date
FROM users u
LEFT JOIN fish_catches fc ON u.id = fc.user_id
GROUP BY u.id, u.username, u.email;