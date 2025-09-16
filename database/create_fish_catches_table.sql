-- Create fish_catches table for storing fishing data
CREATE TABLE IF NOT EXISTS fish_catches (
    id SERIAL PRIMARY KEY,
    lake_id VARCHAR(255) NOT NULL,
    fish VARCHAR(100) NOT NULL,
    length DECIMAL(5,2), -- Length in cm (e.g., 25.50 cm)
    weight DECIMAL(6,3), -- Weight in kg (e.g., 2.500 kg)
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on lake_id for faster queries
CREATE INDEX IF NOT EXISTS idx_fish_catches_lake_id ON fish_catches(lake_id);

-- Create an index on date for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_fish_catches_date ON fish_catches(date);

-- Create an index on fish type for faster species-based queries
CREATE INDEX IF NOT EXISTS idx_fish_catches_fish ON fish_catches(fish);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_fish_catches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fish_catches_updated_at_trigger
    BEFORE UPDATE ON fish_catches
    FOR EACH ROW
    EXECUTE FUNCTION update_fish_catches_updated_at();