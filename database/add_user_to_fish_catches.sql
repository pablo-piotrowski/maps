-- Migration to add user_id to fish_catches table if it doesn't exist

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fish_catches' AND column_name='user_id') THEN
        ALTER TABLE fish_catches ADD COLUMN user_id INTEGER;
        
        -- Add foreign key constraint
        ALTER TABLE fish_catches ADD CONSTRAINT fk_fish_catches_user_id 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
            
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_fish_catches_user_id ON fish_catches(user_id);
    END IF;
END $$;