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
    title VARCHAR(255) NOT NULL,
    FULLTEXT KEY ft_products_search (title, brand, description),
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
    -- Delivery details captured at checkout (a snapshot, so later profile edits don't change past orders)
    shipping_name VARCHAR(200),
    shipping_phone VARCHAR(20),
    shipping_address VARCHAR(400),
    delivery_method VARCHAR(30),
    payment_method VARCHAR(30),
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    notes VARCHAR(500),
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


-- SELLERS TABLE (a user can become a seller)
CREATE TABLE IF NOT EXISTS sellers (
    user_id INT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    cui VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- RECENTLY VIEWED TABLE (one row per user + product, refreshed on every view)
CREATE TABLE IF NOT EXISTS recently_viewed (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    INDEX idx_recently_viewed_user (user_id, viewed_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Messages sent from the contact page
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(100),
    order_number VARCHAR(30),
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ADMINS (a user listed here gets ROLE_ADMIN and can open /admin)
CREATE TABLE IF NOT EXISTS admins (
    user_id INT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- WEEKLY OFFERS (products shown in the home page carousel, in `position` order)
CREATE TABLE IF NOT EXISTS weekly_offers (
    product_id INT PRIMARY KEY,
    position INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
