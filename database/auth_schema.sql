-- Update users table to include more fields
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update tickets table to link to users
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);

-- Insert sample admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, name, department, role) VALUES
('admin@company.com', '$2b$10$rKvVPZqGH9YvL0J5uZ0LXuYqHZJ9xKw8qJZkGZqHZJ9xKw8qJZkGZ', 'IT Admin', 'IT Department', 'admin'),
('john.doe@company.com', '$2b$10$rKvVPZqGH9YvL0J5uZ0LXuYqHZJ9xKw8qJZkGZqHZJ9xKw8qJZkGZ', 'John Doe', 'Sales', 'user'),
('jane.smith@company.com', '$2b$10$rKvVPZqGH9YvL0J5uZ0LXuYqHZJ9xKw8qJZkGZqHZJ9xKw8qJZkGZ', 'Jane Smith', 'Marketing', 'user');

-- Update trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();