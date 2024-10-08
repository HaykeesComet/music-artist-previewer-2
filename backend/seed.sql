-- Drop tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the favorites table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id VARCHAR(255) NOT NULL,
    track_name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    preview_url VARCHAR(255),
    album_image VARCHAR(255)
);

-- Insert some test users with hashed passwords
-- Make sure to hash 'password123' and 'password456' using bcrypt
-- Example bcrypt hashes:
-- 'password123' -> $2b$10$EtQ8Ro9OS5A6ZRj2CZOTtOOxI6P/f.kKNJnhgXQhJjfPsznJ9u.S2
-- 'password456' -> $2b$10$QcjqEeG9d6N/g9nP9n7OtOq9M/peTLUGBXu3xOdS5m4N1dMWzNu1C

INSERT INTO users (email, password) VALUES
('user1@example.com', '$2b$10$EtQ8Ro9OS5A6ZRj2CZOTtOOxI6P/f.kKNJnhgXQhJjfPsznJ9u.S2'),
('user2@example.com', '$2b$10$QcjqEeG9d6N/g9nP9n7OtOq9M/peTLUGBXu3xOdS5m4N1dMWzNu1C');

-- Insert some test favorite tracks
INSERT INTO favorites (user_id, track_id, track_name, artist_name, preview_url, album_image) VALUES
(1, 'track_123', 'Song 1', 'Artist 1', 'https://preview_url_1.com', 'https://album_image_1.com'),
(2, 'track_456', 'Song 2', 'Artist 2', 'https://preview_url_2.com', 'https://album_image_2.com');