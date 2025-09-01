-- Create the `users` table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    name VARCHAR(100) NOT NULL,         -- First name of the user
    surname VARCHAR(100) NOT NULL,      -- Last name of the user
    username VARCHAR(100) UNIQUE NOT NULL, -- Unique username for the user
    email VARCHAR(150) UNIQUE NOT NULL, -- Unique email for the user
    phone VARCHAR(15),                  -- Phone number of the user
    password VARCHAR(100) NOT NULL      -- Password
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

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ORDER ITEMS TABLE (one row per product in an order)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CART TABLE
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    UNIQUE(user_id, product_id), -- prevent duplicates
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        product_id INT NOT NULL,
                        image_url VARCHAR(255) NOT NULL,
                        is_main BOOLEAN NOT NULL DEFAULT FALSE,
                        CONSTRAINT fk_product
                            FOREIGN KEY (product_id) REFERENCES products(id)
                                ON DELETE CASCADE
);

