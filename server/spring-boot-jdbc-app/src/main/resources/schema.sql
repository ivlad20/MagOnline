-- Create the `users` table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    name VARCHAR(100) NOT NULL,         -- First name of the user
    surname VARCHAR(100) NOT NULL,      -- Last name of the user
    username VARCHAR(100) UNIQUE NOT NULL, -- Unique username for the user
    email VARCHAR(150) UNIQUE NOT NULL, -- Unique email for the user
    phone VARCHAR(15)                   -- Phone number of the user
    );

-- Create the `addresses` table if it doesn't exist
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,     -- Unique identifier for each address
    street VARCHAR(150) NOT NULL,          -- Street address
    city VARCHAR(100) NOT NULL,            -- City
    zipcode VARCHAR(10) NOT NULL,          -- Postal code
    apartment VARCHAR(50),                 -- Apartment number (optional)
    floor VARCHAR(10),                     -- Floor number (optional)
    user_id INT NOT NULL,                  -- Foreign key linking to the users table
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Cascade delete addresses when user is deleted
    );
